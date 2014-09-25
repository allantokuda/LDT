require 'spec_helper'

describe 'Overlap prevention', js: true do
  it 'prevents arrowheads competing for the bottom right from overlapping' do
    visit '/'

    # reference entity 0 where the conflict will occur
    create_entity 100, 200
    rename_entity 0, 'Angela'

    # entity 1 on the right side, offset down beyond where a horizontal relationship can be drawn
    create_entity 450, 350
    rename_entity 1, 'Dwight'

    # another entity 2 also on the bottom right, farther down
    create_entity 430, 400
    rename_entity 2, 'Andy'

    create_relationship 0, 1
    create_relationship 0, 2

    # SVG paths for connectors at competing locations
    # (both want to be at the bottom)
    second_to_bottom = "M220,320m7,-3 l0,-4 l4,0 l0,2 l2,0 m2,0 l2,0"
    bottom           = "M220,340m7,-3 l0,-4 l4,0 l0,2 l2,0 m2,0 l2,0"

    expect_arrowhead 0, second_to_bottom
    expect_arrowhead 2, bottom

    delete_entity 2
    wiggle_entity 1

    # arrowhead 2 should be gone, so arrowhead 0 should now be at the bottom
    expect_arrowhead 0, bottom
  end
end
