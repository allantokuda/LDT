class AddEntityName < ActiveRecord::Migration
  def change
    add_column :entities, :name, :string
  end
end
