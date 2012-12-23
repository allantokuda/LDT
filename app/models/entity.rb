class Entity < ActiveRecord::Base
  attr_accessible :name, :height, :width, :x, :y, :attrib
end
