require 'spec_helper'

describe 'Entities and relationships', js: true do
  it 'can be drawn' do
    visit '/'
    window_size 1200, 900

    create_entity 100, 200
    create_entity 600, 200

    rename_entity 0, 'Car'
    rename_entity 1, 'Wheel'

    set_attributes 0, "make*\nmodel*\nyear*\ncolor"
    set_attributes 1, "wheel_id*\nwidth\nradius\n"

    create_relationship 0, 1

    # Question marks on both sides
    expect_arrowhead 0, "M220,270m30,0 l-10,0"
    expect_arrowhead 1, "M600,270m-30,0 l10,0"

    find('#degree-button').click
    find('#click-area-0').click # click once to have a degree-one link
    find('#click-area-1').click # click once, then
    find('#click-area-1').click # click a second time to create a degree-many link

    # One on left, many on right
    expect_arrowhead 0, "M220,270m30,0 l-30,0"
    expect_arrowhead 1, "M600,270m-30,0 l30,0 m0,10 l-20,-10 l20,-10"

    find('#identifier-bar-button').click
    find('#click-area-1').click

    # One on left, and Many plus Bar on right
    expect_arrowhead 1, "M600,270m-30,0 l30,0 m0,10 l-20,-10 l20,-10 m-25,20 l0,-20"

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
    expect(find('#click-area-0').native.location.y).to eq 255
    expect(find('#click-area-1').native.location.y).to eq 255

    # One on left, and Many plus Bar on right
    expect_arrowhead 0, "M220,270m30,0 l-30,0"
    expect_arrowhead 1, "M600,270m-30,0 l30,0 m0,10 l-20,-10 l20,-10 m-25,20 l0,-20"

    expect_label 0, 'be supported by'
    expect_label 1, 'support'
  end

  it 'does not matter which entity you pick first when drawing a relationship' do
    visit '/'

    create_entity 100, 200
    create_entity 600, 200

    # click in reverse order: newer and then older entity
    create_relationship 1, 0

    # Question marks on both sides

    expect_arrowhead 0, "M600,270m-30,0 l10,0"
    expect_arrowhead 1, "M220,270m30,0 l-10,0"
  end
end
