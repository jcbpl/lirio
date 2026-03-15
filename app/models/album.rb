class Album < ApplicationRecord
  belongs_to :library
  has_many :tracks, -> { order(:track_number) }, dependent: :destroy

  validates :external_id, presence: true, uniqueness: { scope: :library_id }
  validates :title, :artist, presence: true

  scope :alphabetical, -> { order(:sort_title) }

  def tracks_synced?
    tracks.exists?
  end

  def sync_tracks(tracks_params)
    return if tracks_params.empty?

    result = tracks.upsert_all(tracks_params, unique_by: %i[album_id external_id], returning: %w[id])
    tracks.where.not(id: result.rows.flatten).delete_all
  end
end
