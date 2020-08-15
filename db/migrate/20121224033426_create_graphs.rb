class CreateGraphs < ActiveRecord::Migration[5.2]
  def change
    create_table :graphs do |t|
      t.string :name
      t.text :description
      t.string :short_name
      t.string :read_password
      t.string :write_password

      t.timestamps
    end

    create_table :graph_snapshots do |t|
      t.integer :graph_id
      t.string :tag
      t.text :notes

      t.timestamps
    end

    add_column :entities, :graph_snapshot_id, :integer

    create_table :relationships do |t|
      t.integer :graph_snapshot_id
      t.integer :entity1_id
      t.integer :entity2_id
    end
  end
end
