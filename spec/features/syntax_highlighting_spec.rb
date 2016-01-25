require 'spec_helper'

describe 'Syntax highlighting', js: true do

  fixture_filename='spec/fixtures/syntax_highlighting.dat'

  def endpoint_locations
    (endpoint_location(0) + endpoint_location(1)).join ','
  end

  def move_and_check(entity_id, dx, dy)
    move_entity entity_id, dx, dy

    @fixture.next(endpoint_locations)
  end

  it 'highlights problems' do
    visit '/'

    # Prefix rspec command with RECORD_FIXTURE=on to record new
    @fixture = Fixture.new fixture_filename, self

    window_size 1200, 900

    if (all('div.guide-enabled').length == 0)
      find('#guide-button').click
    end

    create_entity 150, 200
    create_entity 450, 200

    create_relationship 0, 1

    toggle_identifier_bar 0
    toggle_identifier_bar 1

    expect(find('.syntaxError title')).to have_text 'ERROR: Both links of a relationship cannot contribute to identifiers.'
    expect(find('.syntaxError title')).to have_text 'ERROR: A one-one relationship must have labels.'

    find('#guide-button').click
  end

  # TODO test the that the highlighting follows the content as it's dragged around
end
