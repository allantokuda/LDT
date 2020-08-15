require 'spec_helper'

describe 'Editor', js: true do
  # Regression test for bug where ghost relationships remained after being deleted
  it 'draws replacement relationships the same as previous relationships' do
    visit '/'
    window_size 1200, 900

    left  = "M220,275m30,0 l-10,0"
    right = "M400,275m-30,0 l10,0"

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
