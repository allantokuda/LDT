require 'spec_helper'

# Following example: https://www.youtube.com/watch?v=np7bOY_CGy4
describe 'Editor', js: true do
  def refresh
    # edit to a special value and then don't save it, to give Capybara something to wait for
    # to know when the page has reloaded
    find('#graph-name').set '(reloading)'
    visit current_path
    find('#graph-name').should { |element| element.value != '(reloading)' }
  end

  def save
    find('#save-button').click
    find('#save-message').should have_content 'Saved'
  end

  def expect_graph_name(expected_name)
    find('#graph-name').should { |element| element.value == expected_name }
    page.should { |page| page.title == expected_name }
  end

  it 'Has a default graph name which can be changed, saved, and retrieved' do
    visit '/'
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

  it 'Allows entities and detailed relationships to be drawn' do
    visit '/'
    find('#new-entity-button').click
    find('#canvas').click_at(100,200) # method in spec_helper.rb
    find('#entity-0 .entity-heading .entity-name').double_click # method in spec_helper.rb
    find('#entity-0 .entity-heading .entity-name-input').set 'Car'

    find('#new-entity-button').click
    find('#canvas').click_at(600,200) # method in spec_helper.rb
    find('#entity-1 .entity-heading .entity-name').double_click # method in spec_helper.rb
    find('#entity-1 .entity-heading .entity-name-input').set 'Wheel'

    find('#new-relationship-button').click
    find('#entity-0 .select-shield').click
    find('#entity-1 .select-shield').click

    # Question marks on both sides
    find('#endpoint-0').should { |path| path[:d] == "M220,275m7,-3 l0,-4 l4,0 l0,2 l2,0 m2,0 l2,0" }
    find('#endpoint-1').should { |path| path[:d] == "M600,275m-7,3 l0,4 l-4,0 l0,-2 l-2,0 m-2,0 l-2,0" }

    find('#chickenfoot-button').click
    find('#click-area-0').click # click once to have a degree-one link
    find('#click-area-1').click # click once, then
    find('#click-area-1').click # click a second time to create a degree-many link

    # One on left, many on right
    find('#endpoint-0').should { |path| path[:d] == "M220,275m0,0" }
    find('#endpoint-1').should { |path| path[:d] == "M600,275m0,10 l-20,-10 l20,-10" }

    find('#identifier-bar-button').click
    find('#click-area-1').click

    # One on left, and Many plus Bar on right
    find('#endpoint-1').should { |path| path[:d] == "M600,275m0,10 l-20,-10 l20,-10 m-25,20 l0,-20" }

    find('#label-button').click
    find('#click-area-0').click
    find('#label-input-0').set 'be supported by'
    find('#canvas').click

    find('#label-button').click
    find('#click-area-1').click
    find('#label-input-1').set 'support'
    find('#canvas').click

    save
    refresh

    find('#entity-0 .entity-heading .entity-name').should have_content 'Car'
    find('#entity-1 .entity-heading .entity-name').should have_content 'Wheel'

    # Default entity is 100x120 and we placed these at y=200.
    # Relationship y equals entity's (y + height/2) = (200 + 120/2) = 260
    find('#click-area-0').should { |element| element.native.location.y == 260 }
    find('#click-area-1').should { |element| element.native.location.y == 260 }

    # One on left, and Many plus Bar on right
    find('#endpoint-0').should { |path| path[:d] == "M220,275m0,0" }
    find('#endpoint-1').should { |path| path[:d] == "M600,275m0,10 l-20,-10 l20,-10 m-25,20 l0,-20" }

    find('#label-0').should { |label| label.value == 'be supported by' }
    find('#label-1').should { |label| label.value == 'support' }
  end
end
