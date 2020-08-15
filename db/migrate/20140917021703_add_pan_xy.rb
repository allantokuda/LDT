class AddPanXy < ActiveRecord::Migration[5.2]
  def change
    add_column :graphs, :pan_x, :integer
    add_column :graphs, :pan_y, :integer
  end
end
