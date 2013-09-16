class Graph < ActiveRecord::Base
  ATTRIBUTES = [:name, :short_name, :description, :read_password, :write_password, :entities, :relationships]

  attr_accessible :created_at, *ATTRIBUTES

  def self.new_from_request(params_graph_json)
    self.new(self.parse_base_parameters(params_graph_json))
  end

  def update_attributes_from_request(params_graph_json)
    update_attributes(self.class.parse_base_parameters(params_graph_json))
  end

  # Leave the entities and relationships unparsed for storage in JSON
  def self.parse_base_parameters(graph_json)
    hash = JSON.parse(graph_json, :symbolize_names => true)
    hash[:entities]      = JSON.unparse hash[:entities]
    hash[:relationships] = JSON.unparse hash[:relationships]
    hash
  end
end
