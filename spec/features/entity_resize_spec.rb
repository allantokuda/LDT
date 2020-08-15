require 'spec_helper'

describe 'Entity resize', js: true do

  it 'is ensured whenever possible' do
    visit '/'

    window_size 1200, 900

    create_entity 200, 450
    create_entity   0, 450
    create_entity 200, 200
    create_entity 400, 450
    create_entity 200, 700

    (1..4).each { |n| create_relationship 0, n }

    resize_entity 0, :top,    -20
    resize_entity 0, :right,   20
    resize_entity 0, :bottom,  20
    resize_entity 0, :left,   -20

    save
    refresh

    expect(endpoint_location(0)).to eq [180, 520]
    expect(endpoint_location(1)).to eq [120, 520]
    expect(endpoint_location(2)).to eq [260, 430]
    expect(endpoint_location(3)).to eq [260, 345]
  end
end
