require 'spec_helper'

# Following example: https://www.youtube.com/watch?v=np7bOY_CGy4
describe 'Editor', js: true do
  it 'Has a default graph name which can be changed, saved, and retrieved' do
    visit '/'
    find('#graph-name').should { |element| element.value == 'Untitled Graph' }
    page.title.should eq 'Untitled Graph'

    find('#graph-name').set 'Banana'
    find('#save-button').click
    find('#save-message').should have_content 'Saved'
    find('#graph-name').set '-' # edit not to be saved, that lets Capybara see the page has reloaded
    visit current_path
    find('#graph-name').should { |element| element.value == 'Banana' }
    page.should { |page| page.title == 'Banana' }

    find('#graph-name').set ''
    find('#save-button').click
    find('#save-message').should have_content 'Saved'
    find('#graph-name').set '-' # edit not to be saved, that lets Capybara see the page has reloaded
    visit current_path
    find('#graph-name').should { |element| element.value == '' }
    page.should { |page| page.title == '' }
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
    find('#entity-0').click
    find('#entity-1').click

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
