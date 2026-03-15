require "test_helper"

module Albums
  class TracksControllerTest < ActionDispatch::IntegrationTest
    test "update renders flash on sync failure" do
      album = albums(:boys_of_faith)

      put album_tracks_url(album.external_id), params: {
        tracks: [{ external_id: "x", title: nil, artist: nil }]
      }, as: :turbo_stream

      assert_response :success
      assert_includes response.body, "Track sync failed"
    end
  end
end
