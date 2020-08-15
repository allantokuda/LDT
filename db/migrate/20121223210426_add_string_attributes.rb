class AddStringAttributes < ActiveRecord::Migration[5.2]
  def change
    add_column :entities, :attrib, :string
  end
end
