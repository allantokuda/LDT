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
    graph.entities      = graph.entities
    graph.relationships = graph.relationships
    graph
  end

  def update_attributes_from_request(params_graph_json)
    update_attributes(self.class.parse_base_parameters(params_graph_json))
  end

  # Leave the entities and relationships unparsed for storage in JSON
  def self.parse_base_parameters(graph)
    graph = graph.symbolize_keys.select{ |k| editable_attributes.include? k }
    graph[:entities]      = JSON.unparse graph[:entities]
    graph[:relationships] = JSON.unparse graph[:relationships]
    graph
  end

  def self.editable_attributes
    [ :name, :pan_x, :pan_y, :entities, :relationships ]
  end

  def representation
    {
      id: string_id,
      name: name,
      pan_x: pan_x,
      pan_y: pan_y,
      created_at: created_at,
      updated_at: updated_at,
      entities: JSON.parse(entities),
      relationships: JSON.parse(relationships),
    }
  end
end
