class AddStringIdentifier < ActiveRecord::Migration
  def up
    add_column :graphs, :string_id, :string
    Graph.all.each do |g|
      g.update_attribute :string_id, Graph.generate_string_id
    end
    change_column :graphs, :string_id, :string, :null => false
  end

  def down
    remove_column :graphs, :string_id
  end
end
