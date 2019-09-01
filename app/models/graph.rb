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

  def self.create_from_request(params)
    self.create(self.class.parse_base_parameters(params))
  end

  def update_attributes_from_request(params)
    params["entities"]      ||= []
    params["relationships"] ||= []
    update_attributes(self.class.parse_base_parameters(params))
  end

  # Save the entities and relationships in JSON
  def self.parse_base_parameters(params)
    params[:entities]      = params[:entities     ].select(&:present?).to_json
    params[:relationships] = params[:relationships].select(&:present?).to_json
    params
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
