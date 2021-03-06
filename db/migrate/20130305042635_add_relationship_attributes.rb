class AddRelationshipAttributes < ActiveRecord::Migration[5.2]
  def change
    add_column :relationships, :label1, :string
    add_column :relationships, :label2, :string
    add_column :relationships, :symbol1, :string
    add_column :relationships, :symbol2, :string
    add_column :relationships, :clockwise, :boolean
  end
end
