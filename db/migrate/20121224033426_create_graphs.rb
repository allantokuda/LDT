class CreateGraphs < ActiveRecord::Migration
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
      t.integer :graph
      t.integer :local_id
      t.string :tag
      t.text :notes

      t.timestamps
    end

    add_column :entities, :graph, :integer
    add_column :entities, :snapshot, :integer
    add_column :entities, :local_id, :integer

    create_table :relationships do |t|
      t.integer :graph
      t.integer :snapshot
      t.integer :local_id
      t.integer :entity1
      t.integer :entity2
    end
  end
end
