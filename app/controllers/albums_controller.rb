class AlbumsController < ApplicationController
  before_action :require_library

  def index
    @albums = current_library.albums.alphabetical
    @recent_ids = current_library.albums.order(created_at: :desc).limit(10).pluck(:external_id)
  end

  def show
    @album = current_library.albums.includes(:tracks).find_by!(external_id: params[:external_id])
  end

  def create
    albums_params = params.expect(albums: [%i[external_id title sort_title artist year cover_art_id song_count duration_seconds]])

    # Capture albums currently in the DOM for Turbo Stream insertion points
    @existing_sorted = current_library.albums.alphabetical.to_a

    result = current_library.sync_albums(albums_params)
    @new_albums = current_library.albums.where(id: result[:new_ids]).alphabetical
    @updated_albums = current_library.albums.where(id: result[:updated_ids])
    @album_count = current_library.albums.count

    render :create, formats: :turbo_stream
  rescue ActiveRecord::StatementInvalid => e
    Rails.error.report(e)
    render turbo_stream: turbo_stream.update("flash", partial: "layouts/flash", locals: { message: "Album sync failed" })
  end
end
