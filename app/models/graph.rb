class Graph < ActiveRecord::Base
  attr_accessible :creation_date, :description, :name, :short_name, :read_password, :write_password

  has_many GraphSnapshots
end
