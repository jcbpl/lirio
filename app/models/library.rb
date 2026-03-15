class Library < ApplicationRecord
  has_many :albums, dependent: :destroy
  has_many :tracks, through: :albums

  validates :name, presence: true

  def sync_albums(albums_params)
    results = albums.upsert_all(
      albums_params,
      unique_by: %i[library_id external_id],
      on_duplicate: Arel.sql(<<~SQL.squish),
        title = excluded.title,
        sort_title = excluded.sort_title,
        artist = excluded.artist,
        year = excluded.year,
        cover_art_id = excluded.cover_art_id,
        song_count = excluded.song_count,
        duration_seconds = excluded.duration_seconds,
        updated_at = excluded.updated_at,
        version = albums.version + 1
      SQL
      returning: %w[id version]
    )

    ids = results.rows.group_by { |_, version| version == 1 ? :new : :updated }
    update!(last_synced_at: Time.current)
    { new_ids: (ids[:new] || []).map(&:first), updated_ids: (ids[:updated] || []).map(&:first) }
  end
end
