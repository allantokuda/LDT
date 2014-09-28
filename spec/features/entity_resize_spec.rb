require 'spec_helper'

describe 'Entity resize', js: true do

  def resize_entity(entity_id, side, distance)
    element = find("#entity-#{entity_id}")

    x1 = 1
    y1 = 1
    xC = element.native.size.width  / 2
    yC = element.native.size.height / 2
    x2 = element.native.size.width  - 1
    y2 = element.native.size.height - 1

    x, y, dx, dy = case side
                   when :top;    [xC, y1, 0, distance]
                   when :bottom; [xC, y2, 0, distance]
                   when :left;   [x1, yC, distance, 0]
                   when :right;  [x2, yC, distance, 0]
                   end

    element.drag_at x, y, dx, dy
  end

  it 'is ensured whenever possible' do
    visit '/'

    window_size 900, 900

    create_entity 200, 350
    create_entity   0, 350
    create_entity 200, 100
    create_entity 400, 350
    create_entity 200, 600

    (1..4).each { |n| create_relationship 0, n }

    resize_entity 0, :top,    -20
    resize_entity 0, :right,   20
    resize_entity 0, :bottom,  20
    resize_entity 0, :left,   -20

    save
    refresh

    expect(endpoint_location(0)).to eq [180, 425]
    expect(endpoint_location(1)).to eq [120, 425]
    expect(endpoint_location(2)).to eq [260, 330]
    expect(endpoint_location(3)).to eq [260, 250]
  end
end
