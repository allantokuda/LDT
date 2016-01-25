require 'spec_helper'

describe 'Relationship straightness', js: true do

  fixture_filename='spec/fixtures/relationship_straightness.dat'

  def endpoint_locations
    (endpoint_location(0) + endpoint_location(1)).join ','
  end

  def move_and_check(entity_id, dx, dy)
    move_entity entity_id, dx, dy

    @fixture.next(endpoint_locations)
  end

  it 'is ensured whenever possible' do
    visit '/'

    # Prefix rspec command with RECORD_FIXTURE=on to record new
    @fixture = Fixture.new fixture_filename, self

    window_size 900, 900

    create_entity 200, 400
    create_entity   0, 200

    create_relationship 0, 1

    # Get rid of question marks. Degree-1 is simplest to test here
    change_degree 0
    change_degree 1

    drag_amount = 40

    # Drag entity #1 right, then down.
    # Going 180 degrees around the entity like this actually tests 360 degrees
    # of behavior when both endpoints are considered
    10.times { |n| move_and_check(1, drag_amount, 0) }
    10.times { |n| move_and_check(1, 0, drag_amount) }
  end
end
