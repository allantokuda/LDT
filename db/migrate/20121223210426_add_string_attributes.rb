class AddStringAttributes < ActiveRecord::Migration
  def change
    add_column :entities, :attrib, :string
  end
end
