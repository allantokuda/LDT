class Graph < ActiveRecord::Base
  attr_accessible :creation_date, :description, :name, :short_name, :read_password, :write_password

  has_many GraphSnapshots

  def snapshot(num)
    GraphSnapshots.find(params[:num])
  end
  def snapshot_newest()
    GraphSnapshots.last
  end
end
