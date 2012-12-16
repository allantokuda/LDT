class CreateEntities < ActiveRecord::Migration
  def change
    create_table :entities do |t|
      t.integer :x
      t.integer :y
      t.integer :width
      t.integer :height

      t.timestamps
    end
  end
end
