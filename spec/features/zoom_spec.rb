require 'spec_helper'

describe 'Canvas zoom', js: true do

  it 'allows different amounts of the graph to be shown on screen or on paper at once' do
    visit '/'

    window_size 1200, 900

    create_entity 100, 200
    create_entity 500, 200
    create_entity 500, 700

    create_relationship 0, 1
    create_relationship 0, 2
    create_relationship 1, 2

    x_locations = [333, 222, 148, 98, 65]

    x_locations.each do |xloc|
      zoom_out
      expect(find("#entity-2").native.location.x.to_i).to eq xloc
    end

    x_locations.reverse.each do |xloc|
      expect(find("#entity-2").native.location.x.to_i).to eq xloc
      zoom_in
    end
  end
end
