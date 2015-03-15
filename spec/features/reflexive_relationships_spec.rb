require 'spec_helper'

describe 'Reflexive relationships', js: true do

  fixture_filename='spec/fixtures/reflexive_relationships.dat'

  def endpoint_locations(num_endpoints)
    (0..num_endpoints-1).map { |n| endpoint_location(n) }.join ','
  end

  it 'allows relationships to be drawn from an entity to itself' do
    visit '/'

    # Prefix rspec command with RECORD_FIXTURE=on to record new
    @fixture = Fixture.new fixture_filename, self

    window_size 400, 700

    create_entity 100, 200
    resize_entity 0, :bottom, 100

    # create three reflexive relationships, checking appearance after creating each
    create_relationship 0, 0
    @fixture.next(endpoint_locations(2))

    create_relationship 0, 0
    @fixture.next(endpoint_locations(4))

    create_relationship 0, 0
    @fixture.next(endpoint_locations(6))

    # squeeze them together
    10.times do
      resize_entity 0, :bottom, -10
      @fixture.next(endpoint_locations(6))
    end

    # widen again
    resize_entity 0, :bottom, 100

    # delete middle relationship
    delete_relationship 1
    @fixture.next(endpoint_locations(4))

    # Change entity size to force redraw - currently when you delete one of
    # many reflexives, the others don't jump into new locations instantly. This
    # was initially unintended, but I think I like it because it makes it
    # clearer to the user that they deleted the one they intended to.
    resize_entity 0, :right, 10

    # Check that outer two reflexives have come together to fill the space again
    @fixture.next(endpoint_locations(4))

    delete_relationship 0
    @fixture.next(endpoint_locations(2))

    resize_entity 0, :right, -10
    @fixture.next(endpoint_locations(2))

    # Create another relationship after deleting others. It has been an issue
    # in the past that "phantom" (not fully deleted) relationships take up
    # space that cause new subsequent relationships to be drawn in the wrong
    # places.
    create_relationship 0,0
    @fixture.next(endpoint_locations(4))
  end
end
