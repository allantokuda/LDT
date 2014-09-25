require 'spec_helper'

describe 'Editor', js: true do
  # Regression test for bug where ghost relationships remained after being deleted
  it 'draws replacement relationships the same as previous relationships' do
    visit '/'

    left  = "M220,280m7,-3 l0,-4 l4,0 l0,2 l2,0 m2,0 l2,0"
    right = "M400,280m-7,3 l0,4 l-4,0 l0,-2 l-2,0 m-2,0 l-2,0"

    create_entity 100, 200
    create_entity 400, 210
    create_relationship 0, 1

    expect_arrowhead 0, left
    expect_arrowhead 1, right

    delete_relationship 0
    create_relationship 0, 1

    expect_arrowhead 0, left
    expect_arrowhead 1, right
  end
end
