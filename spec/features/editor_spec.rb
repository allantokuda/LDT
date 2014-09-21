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


end
