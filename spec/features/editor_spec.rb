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

  it 'Allows entities to be drawn' do
    visit '/'
    find('#new-entity-button').click
    find('#canvas').click_at(200,200) # method in spec_helper.rb
    find('#entity-0 .entity-heading .entity-name').double_click # method in spec_helper.rb
    find('#entity-0 .entity-heading .entity-name-input').set 'Entity A'

    find('#new-entity-button').click
    find('#canvas').click_at(500,200) # method in spec_helper.rb
    find('#entity-1 .entity-heading .entity-name').double_click # method in spec_helper.rb
    find('#entity-1 .entity-heading .entity-name-input').set 'Entity B'

    find('#new-relationship-button').click
    find('#entity-0 .select-shield').click
    find('#entity-1 .select-shield').click

    find('#save-button').click
    find('#save-message').should have_content 'Saved'

    # change to dummy value without saving, to allow Capybara to see the page has reloaded
    find('#entity-0 .entity-heading .entity-name').double_click # method in spec_helper.rb
    find('#entity-0 .entity-heading .entity-name-input').set 'dummy'

    visit current_path

    find('#entity-0 .entity-heading .entity-name').should have_content 'Entity A'
    find('#entity-1 .entity-heading .entity-name').should have_content 'Entity B'
  end
end
