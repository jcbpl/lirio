class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  helper_method :current_library

  private
    def current_library
      @current_library ||= Library.first
    end

    def require_library
      redirect_to new_library_path unless current_library
    end
end
