require "test_helper"

class AlbumsControllerTest < ActionDispatch::IntegrationTest
  test "create renders flash on sync failure" do
    post albums_url, params: {
      albums: [{ external_id: "x", title: nil, sort_title: nil, artist: nil }]
    }, as: :turbo_stream

    assert_response :success
    assert_includes response.body, "Album sync failed"
  end
end
