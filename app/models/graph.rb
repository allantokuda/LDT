class Graph < ActiveRecord::Base
  attr_accessible :created_at, :description, :name, :short_name, :read_password, :write_password

  has_many :entities
end
