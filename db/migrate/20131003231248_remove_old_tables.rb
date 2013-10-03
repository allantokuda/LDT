class RemoveOldTables < ActiveRecord::Migration
  def change
    drop_table :entities
    drop_table :relationships
  end
end
