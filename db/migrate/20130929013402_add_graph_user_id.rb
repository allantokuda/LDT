class AddGraphUserId < ActiveRecord::Migration[5.2]
  def change
    add_column :graphs, :user_id, :integer
  end
end
