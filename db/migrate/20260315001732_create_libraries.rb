class CreateLibraries < ActiveRecord::Migration[8.1]
  def change
    create_table :libraries do |t|
      t.string :name, null: false, default: "My Library"
      t.string :source_id
      t.string :source_url
      t.datetime :last_synced_at

      t.timestamps
    end
  end
end
