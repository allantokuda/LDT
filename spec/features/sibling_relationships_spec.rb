require 'spec_helper'

describe 'Sibling relationships', js: true do

  fixture_filename='spec/fixtures/sibling_relationships.dat'

  def endpoint_locations
    (0..7).map { |n| endpoint_location(n) }.join ','
  end

  def move_and_check(entity_id, dx, dy)
    move_entity entity_id, dx, dy

    @fixture.next(endpoint_locations)
  end


  it 'allows multiple relationships to be drawn between the same two entities' do
    visit '/'

    # Prefix rspec command with RECORD_FIXTURE=on to record new
    @fixture = Fixture.new fixture_filename, self

    window_size 1200, 900

    create_entity 100, 300
    create_entity 300, 200
    create_entity 500, 300

    3.times { create_relationship 0, 1 }
    create_relationship 0, 2

    12.times { move_and_check 1, 0, 30 }

    resize_entity 1, :bottom, -90

    12.times { move_and_check 1, 0, -30 }
  end
end
