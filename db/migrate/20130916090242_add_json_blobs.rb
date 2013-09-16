class AddJsonBlobs < ActiveRecord::Migration
  def change
    add_column :graphs, :entities,      :text
    add_column :graphs, :relationships, :text
  end
end
