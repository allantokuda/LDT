class RemoveOldTables < ActiveRecord::Migration[5.2]
  def change
    drop_table :entities
    drop_table :relationships
  end
end
