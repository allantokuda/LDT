class EliminateSnapshots < ActiveRecord::Migration
  def up
    drop_table :graph_snapshots
    rename_column :entities,      :graph_snapshot_id, :graph_id 
    rename_column :relationships, :graph_snapshot_id, :graph_id 
  end
end
