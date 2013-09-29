class AddGraphUserId < ActiveRecord::Migration
  def change
    add_column :graphs, :user_id, :integer
  end
end
