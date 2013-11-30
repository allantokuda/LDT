class Graph < ActiveRecord::Base
  before_create :init

  def to_param
    string_id
  end

  def self.generate_string_id
    existing_ids = Graph.pluck(:string_id)
    str = nil
    while !str || existing_ids.include?(str) do
      str = SecureRandom.random_number(1e12.to_i).to_s
    end
    str
  end

  def init
    self.name ||= "Untitled Graph"
    self.entities ||= JSON.unparse([])
    self.relationships ||= JSON.unparse([])
    self.string_id ||= self.class.generate_string_id
  end

  def self.create_from_request(params_graph_json)
    self.create(self.parse_base_parameters(params_graph_json))
  end

  def self.find_and_parse(string_id)
    graph = self.find_by_string_id(string_id)
    graph.entities      = JSON.parse graph.entities
    graph.relationships = JSON.parse graph.relationships
    graph
  end

  def update_attributes_from_request(params_graph_json)
    update_attributes(self.class.parse_base_parameters(params_graph_json))
  end

  # Leave the entities and relationships unparsed for storage in JSON
  def self.parse_base_parameters(graph_json)
    hash = JSON.parse(graph_json, :symbolize_names => true).reject{ |k| k==:id }
    hash[:entities]      = JSON.unparse hash[:entities]
    hash[:relationships] = JSON.unparse hash[:relationships]
    hash
  end
end
