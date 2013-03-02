class Entity < ActiveRecord::Base
  attr_accessible :name, :height, :width, :x, :y, :attrib
  attr_accessible :graph_id  # Temporary until new button exists on graph editor

  belongs_to :graph
  has_many :relationship_starts, :class_name => Relationship
  has_many :relationship_ends, :class_name => Relationship
end
