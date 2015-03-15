require 'spec_helper'

describe 'Entity resize', js: true do

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
