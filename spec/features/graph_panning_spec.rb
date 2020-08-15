require 'spec_helper'

describe 'Graph panning', js: true do
  it 'allows the graph view to be infinitely panned by dragging' do
    visit '/'
    window_size 1200, 900

    create_entity 100, 200
    create_entity 300, 200
    create_relationship 0, 1

    find('#canvas').drag(50, 50)

    check_locations

    save
    refresh

    check_locations
  end

  def check_locations
    check_location '#entity-0', 150, 245
    check_location '#entity-1', 350, 245

    check_location '#endpoint-0', 270, 320
    check_location '#endpoint-1', 320, 320
  end
end
