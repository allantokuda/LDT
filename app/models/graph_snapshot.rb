class GraphSnapshot < ActiveRecord::Base
  attr_accessible :modification_date, :notes, :tag

  belongs_to Graph
  has_many Entitys
end
