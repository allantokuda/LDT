class Relationship < ActiveRecord::Base
  attr_accessible :shape, :ident1, :ident2, :label1, :label2, :max_degree1, :max_degree2, :orientation

end
