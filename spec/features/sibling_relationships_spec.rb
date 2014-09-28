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

    # Add :record option to record new
    @fixture = Fixture.new fixture_filename, self

    window_size 900, 900

    create_entity 100, 200
    create_entity 300, 100
    create_entity 500, 200

    3.times { create_relationship 0, 1 }
    create_relationship 0, 2

    12.times { move_and_check 1, 0, 30 }

  end
end
