require 'spec_helper'

describe 'Entities and relationships', js: true do
  it 'can be drawn' do
    visit '/'

    create_entity 100, 200
    create_entity 600, 200

    rename_entity 0, 'Car'
    rename_entity 1, 'Wheel'

    set_attributes 0, "make*\nmodel*\nyear*\ncolor"
    set_attributes 1, "wheel_id*\nwidth\nradius\n"

    create_relationship 0, 1

    # Question marks on both sides
    expect_arrowhead 0, "M220,275m7,-3 l0,-4 l4,0 l0,2 l2,0 m2,0 l2,0"
    expect_arrowhead 1, "M600,275m-7,3 l0,4 l-4,0 l0,-2 l-2,0 m-2,0 l-2,0"

    find('#chickenfoot-button').click
    find('#click-area-0').click # click once to have a degree-one link
    find('#click-area-1').click # click once, then
    find('#click-area-1').click # click a second time to create a degree-many link

    # One on left, many on right
    expect_arrowhead 0, "M220,275m0,0 l0,0"
    expect_arrowhead 1, "M600,275m0,10 l-20,-10 l20,-10"

    find('#identifier-bar-button').click
    find('#click-area-1').click

    # One on left, and Many plus Bar on right
    expect_arrowhead 1, "M600,275m0,10 l-20,-10 l20,-10 m-25,20 l0,-20"

    set_label 0, 'be supported by'
    set_label 1, 'support'

    save
    refresh

    expect_entity_name 0, 'Car'
    expect_entity_name 1, 'Wheel'

    expect_attribute 0, 0, 'make', true
    expect_attribute 0, 1, 'model', true
    expect_attribute 0, 2, 'year', true
    expect_attribute 0, 3, 'color'
    expect_attribute 1, 0, 'wheel_id', true
    expect_attribute 1, 1, 'width'
    expect_attribute 1, 2, 'radius'

    # Default entity is 100x120 and we placed these at y=200.
    # Relationship y equals entity's (y + height/2) = (200 + 120/2) = 260
    expect(find('#click-area-0')).to respond(to: [:native, :location, :y], with: 260)
    expect(find('#click-area-1')).to respond(to: [:native, :location, :y], with: 260)

    # One on left, and Many plus Bar on right
    expect_arrowhead 0, "M220,275m0,0 l0,0"
    expect_arrowhead 1, "M600,275m0,10 l-20,-10 l20,-10 m-25,20 l0,-20"

    expect_label 0, 'be supported by'
    expect_label 1, 'support'
  end
end
