class GraphSnapshot < ActiveRecord::Base
  attr_accessible :modification_date, :notes, :tag

  belongs_to :graph
  has_many :entities
end
