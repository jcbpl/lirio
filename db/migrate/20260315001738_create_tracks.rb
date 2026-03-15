class CreateTracks < ActiveRecord::Migration[8.1]
  def change
    create_table :tracks do |t|
      t.string :external_id, null: false
      t.references :album, null: false, foreign_key: true
      t.string :title, null: false
      t.string :artist, null: false
      t.integer :track_number, default: 0
      t.integer :duration_seconds, default: 0

      t.timestamps
    end

    add_index :tracks, %i[album_id external_id], unique: true
    add_index :tracks, %i[album_id track_number]
  end
end
