class AddVersionToAlbums < ActiveRecord::Migration[8.1]
  def change
    add_column :albums, :version, :integer, default: 1, null: false
  end
end
