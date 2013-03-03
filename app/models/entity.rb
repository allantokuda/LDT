class Entity < ActiveRecord::Base
  attr_accessible :name, :height, :width, :x, :y, :attrib
  attr_accessible :graph_id  # Temporary until new button exists on graph editor

  belongs_to :graph
  has_many :relationship_starts, :class_name => Relationship
  has_many :relationship_ends, :class_name => Relationship

  # Send a hash including an entity ID and other attributes
  # to update an entity accordingly
  def self.update_from_hash(e)
    self.find(e[:id]).update_attributes(
      :name   => e[:name],
      :x      => e[:x],
      :y      => e[:y],
      :width  => e[:width],
      :height => e[:height],
      :attrib => e[:attrib]
    )
  end
end
