module Albums
  class TracksController < ApplicationController
    before_action :require_library

    def update
      @album = current_library.albums.includes(:tracks).find_by!(external_id: params[:album_external_id])
      tracks_params = params.expect(tracks: [%i[external_id title artist track_number duration_seconds]])
      @album.sync_tracks(tracks_params)
      render :update, formats: :turbo_stream
    rescue ActiveRecord::StatementInvalid => e
      Rails.error.report(e)
      render turbo_stream: turbo_stream.update("track-list", partial: "layouts/flash", locals: { message: "Track sync failed" })
    end
  end
end
