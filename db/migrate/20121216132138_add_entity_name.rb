class AddEntityName < ActiveRecord::Migration[5.2]
  def change
    add_column :entities, :name, :string
  end
end
