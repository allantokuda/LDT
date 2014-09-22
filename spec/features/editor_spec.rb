require 'spec_helper'

# Following example: https://www.youtube.com/watch?v=np7bOY_CGy4
describe 'Editor', js: true do
  def refresh
    # edit to a special value and then don't save it, to give Capybara something to wait for
    # to know when the page has reloaded
    find('#graph-name').set '(reloading)'
    visit current_path
    expect(find('#graph-name')).not_to respond(to: [:value], with: '(reloading)')
  end

  def save
    find('#save-button').click
    expect(find('#save-message')).to have_content 'Saved'
  end

  def expect_graph_name(expected_name)
    expect(find('#graph-name')).to respond(to: [:value], with: expected_name)
    expect(page).to respond(to: [:title], with: expected_name)
  end

  def create_entity(x,y)
    find('#new-entity-button').click
    find('#canvas').click_at(x,y)
  end

  def rename_entity(entity_id, name)
    # 'click_at' and 'double_click' are defined in spec_helper.rb
    find("#entity-#{entity_id} .entity-heading .entity-name").double_click
    find("#entity-#{entity_id} .entity-heading .entity-name-input").set name
    finish_editing
  end

  def finish_editing
    # finish editing by clicking on an unoccupied location on the canvas
    find('#canvas').click_at(1,1)
  end

  def create_relationship(entity_id1, entity_id2)
    find('#new-relationship-button').click
    find("#entity-#{entity_id1} .select-shield").click
    find("#entity-#{entity_id2} .select-shield").click
  end

  def expect_arrowhead(endpoint_id, path_data)
    expect(find("#endpoint-#{endpoint_id}")).to have_svg_path_data path_data
  end

  def set_label(endpoint_id, label_text)
    find('#label-button').click
    find("#click-area-#{endpoint_id}").click
    find("#label-input-#{endpoint_id}").set label_text
    finish_editing
  end

  def expect_label(endpoint_id, label_text)
    expect(find("#label-#{endpoint_id}")).to respond(to: [:text], with: label_text)
  end

  def expect_entity_name(entity_id, entity_name)
    expect(find("#entity-#{entity_id} .entity-heading .entity-name")).to respond(to: [:text], with: entity_name)
  end

  it 'Has a default graph name which can be changed, saved, and retrieved' do
    visit '/'

    sleep(0.5) # Having trouble getting this one to wait
    expect_graph_name 'Untitled Graph'

    # Can be changed to an arbitrary name
    find('#graph-name').set 'Banana'
    save
    refresh
    expect_graph_name 'Banana'

    # Blank name is also allowed
    find('#graph-name').set ''
    save
    refresh
    expect_graph_name ''
  end

  it 'Allows entities and relationships to be drawn' do
    visit '/'

    create_entity 100, 200
    create_entity 600, 200

    rename_entity 0, 'Car'
    rename_entity 1, 'Wheel'

    create_relationship 0, 1

    # Question marks on both sides
    expect_arrowhead 0, "M220,275m7,-3 l0,-4 l4,0 l0,2 l2,0 m2,0 l2,0"
    expect_arrowhead 1, "M600,275m-7,3 l0,4 l-4,0 l0,-2 l-2,0 m-2,0 l-2,0"

    find('#chickenfoot-button').click
    find('#click-area-0').click # click once to have a degree-one link
    find('#click-area-1').click # click once, then
    find('#click-area-1').click # click a second time to create a degree-many link

    # One on left, many on right
    expect_arrowhead 0, "M220,275m0,0"
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

    # Default entity is 100x120 and we placed these at y=200.
    # Relationship y equals entity's (y + height/2) = (200 + 120/2) = 260
    expect(find('#click-area-0')).to respond(to: [:native, :location, :y], with: 260)
    expect(find('#click-area-1')).to respond(to: [:native, :location, :y], with: 260)

    # One on left, and Many plus Bar on right
    expect_arrowhead 0, "M220,275m0,0"
    expect_arrowhead 1, "M600,275m0,10 l-20,-10 l20,-10 m-25,20 l0,-20"

    expect_label 0, 'be supported by'
    expect_label 1, 'support'
  end

  it 'prevents arrowheads from overlapping' do
    visit '/'

    # reference entity 0 where the conflict will occur
    create_entity 100, 200
    rename_entity 0, 'Angela'

    # entity 1 on the right side, offset down beyond where a horizontal relationship can be drawn
    create_entity 450, 350
    rename_entity 1, 'Dwight'

    # another entity 2 also on the bottom right, farther down
    create_entity 430, 400
    rename_entity 2, 'Andy'

    create_relationship 0, 1
    create_relationship 0, 2

    expect_arrowhead 0, "M220,320m7,-3 l0,-4 l4,0 l0,2 l2,0 m2,0 l2,0"
    expect_arrowhead 2, "M220,340m7,-3 l0,-4 l4,0 l0,2 l2,0 m2,0 l2,0"
  end

  xit 'allows entities to be deleted, and simultaneously deletes all connected relationships' do
  end

  xit 'allows the graph view to be infinitely panned by dragging' do
  end

  xit 'keeps the relationships straight as the entity is moved' do
  end

  xit 'supports multiple relationships between the same two entities' do
  end
end
