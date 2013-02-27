class Graph < ActiveRecord::Base
  attr_accessible :creation_date, :description, :name, :short_name, :read_password, :write_password

  has_many :graph_snapshots
  alias :snapshots :graph_snapshots

  def snapshot(num)
    self.snapshots.find(num)
  end
  def snapshot_newest()
    if self.snapshots.any?
      self.snapshots.last
    else
      self.snapshots.build()
    end
  end
end
