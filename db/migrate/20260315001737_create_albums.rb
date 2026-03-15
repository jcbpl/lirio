class CreateAlbums < ActiveRecord::Migration[8.1]
  def change
    create_table :albums do |t|
      t.references :library, null: false, foreign_key: true
      t.string :external_id, null: false
      t.string :title, null: false
      t.string :sort_title, null: false
      t.string :artist, null: false
      t.integer :year
      t.string :cover_art_id
      t.integer :song_count, default: 0
      t.integer :duration_seconds, default: 0

      t.timestamps
    end

    add_index :albums, %i[library_id external_id], unique: true
    add_index :albums, :sort_title
  end
end
