class LibrariesController < ApplicationController
  def index
    redirect_to root_path if Library.exists?
  end

  def new
    @library = Library.new
  end

  def create
    @library = Library.new(library_params)

    if @library.save
      redirect_to root_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    Library.find(params[:id]).destroy
    redirect_to new_library_path
  end

  private
    def library_params
      params.expect(library: %i[name source_id source_url])
    end
end
