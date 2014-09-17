class AddPanXy < ActiveRecord::Migration
  def change
    add_column :graphs, :pan_x, :integer
    add_column :graphs, :pan_y, :integer
  end
end
