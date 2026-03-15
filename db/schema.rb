# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_15_205927) do
  create_table "albums", force: :cascade do |t|
    t.string "artist", null: false
    t.string "cover_art_id"
    t.datetime "created_at", null: false
    t.integer "duration_seconds", default: 0
    t.string "external_id", null: false
    t.integer "library_id", null: false
    t.integer "song_count", default: 0
    t.string "sort_title", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.integer "version", default: 1, null: false
    t.integer "year"
    t.index ["library_id", "external_id"], name: "index_albums_on_library_id_and_external_id", unique: true
    t.index ["library_id"], name: "index_albums_on_library_id"
    t.index ["sort_title"], name: "index_albums_on_sort_title"
  end

  create_table "libraries", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "last_synced_at"
    t.string "name", default: "My Library", null: false
    t.string "source_id"
    t.string "source_url"
    t.datetime "updated_at", null: false
  end

  create_table "tracks", force: :cascade do |t|
    t.integer "album_id", null: false
    t.string "artist", null: false
    t.datetime "created_at", null: false
    t.integer "duration_seconds", default: 0
    t.string "external_id", null: false
    t.string "title", null: false
    t.integer "track_number", default: 0
    t.datetime "updated_at", null: false
    t.index ["album_id", "external_id"], name: "index_tracks_on_album_id_and_external_id", unique: true
    t.index ["album_id", "track_number"], name: "index_tracks_on_album_id_and_track_number"
    t.index ["album_id"], name: "index_tracks_on_album_id"
  end

  add_foreign_key "albums", "libraries"
  add_foreign_key "tracks", "albums"
end
