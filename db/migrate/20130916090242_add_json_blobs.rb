class AddJsonBlobs < ActiveRecord::Migration[5.2]
  def change
    add_column :graphs, :entities,      :text
    add_column :graphs, :relationships, :text
  end
end
