require "test_helper"

class AlbumTest < ActiveSupport::TestCase
  setup do
    @library = libraries(:default)
  end

  test "sync_albums inserts new albums" do
    result = @library.sync_albums([
      { external_id: "new-1", title: "New Album", sort_title: "new album", artist: "Artist", year: 2024,
        song_count: 10, duration_seconds: 3600 }
    ])

    assert_equal 1, result[:new_ids].size
    assert_empty result[:updated_ids]
    assert_equal "New Album", Album.find(result[:new_ids].first).title
  end

  test "sync_albums updates existing albums" do
    result = @library.sync_albums([
      { external_id: "album-1", title: "Boys of Faith (Deluxe)", sort_title: "boys of faith (deluxe)",
        artist: "Zach Bryan", year: 2024, song_count: 5, duration_seconds: 1020 }
    ])

    assert_empty result[:new_ids]
    assert_equal 1, result[:updated_ids].size
    assert_equal "Boys of Faith (Deluxe)", Album.find(result[:updated_ids].first).title
  end

  test "sync_albums increments version on update" do
    album = albums(:boys_of_faith)
    assert_equal 1, album.version

    @library.sync_albums([
      { external_id: "album-1", title: "Boys of Faith", sort_title: "boys of faith",
        artist: "Zach Bryan", year: 2024, song_count: 5, duration_seconds: 1020 }
    ])

    assert_equal 2, album.reload.version
  end

  test "sync_albums handles mix of new and existing albums" do
    result = @library.sync_albums([
      { external_id: "album-1", title: "Boys of Faith", sort_title: "boys of faith",
        artist: "Zach Bryan", year: 2024, song_count: 5, duration_seconds: 1020 },
      { external_id: "new-1", title: "New Album", sort_title: "new album",
        artist: "Artist", year: 2024, song_count: 5, duration_seconds: 1800 }
    ])

    assert_equal 1, result[:new_ids].size
    assert_equal 1, result[:updated_ids].size
  end

  test "sync_albums updates last_synced_at on library" do
    assert_nil @library.last_synced_at

    @library.sync_albums([
      { external_id: "new-1", title: "New Album", sort_title: "new album", artist: "Artist", year: 2024,
        song_count: 1, duration_seconds: 180 }
    ])

    assert_not_nil @library.reload.last_synced_at
  end

  test "sync_tracks upserts tracks and removes missing ones" do
    album = albums(:boys_of_faith)
    album.sync_tracks([
      { external_id: "track-1", title: "Nine Ball (Live)", artist: "Zach Bryan", track_number: 1, duration_seconds: 220 },
      { external_id: "track-6", title: "New Track", artist: "Zach Bryan", track_number: 6, duration_seconds: 180 }
    ])

    album.reload
    assert_equal 2, album.tracks.count
    assert_equal "Nine Ball (Live)", album.tracks.find_by(external_id: "track-1").title
    assert_equal "New Track", album.tracks.find_by(external_id: "track-6").title
    assert_nil album.tracks.find_by(external_id: "track-2")
  end

  test "sync_tracks removes tracks not in params" do
    album = albums(:boys_of_faith)
    assert_equal 5, album.tracks.count

    album.sync_tracks([
      { external_id: "track-1", title: "Nine Ball", artist: "Zach Bryan", track_number: 1, duration_seconds: 196 }
    ])

    assert_equal 1, album.tracks.reload.count
    assert_nil album.tracks.find_by(external_id: "track-2")
  end

  test "sync_tracks with empty params is a no-op" do
    album = albums(:boys_of_faith)
    assert_equal 5, album.tracks.count

    album.sync_tracks([])

    assert_equal 5, album.tracks.reload.count
  end
end
