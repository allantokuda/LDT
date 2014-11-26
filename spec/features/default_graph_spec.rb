require 'spec_helper'

describe 'Default graph', js: true do
  it 'Has a default name which can be changed, saved, and retrieved' do
    visit '/'
    expect_graph_name 'Untitled Graph'

    # Can be changed to an arbitrary name
    find('#graph-name').set 'Banana'
    save
    refresh
    expect_graph_name 'Banana'

    # Blank name is also allowed
    find('#graph-name').set ''
    save
    refresh
    expect_graph_name ''
  end
end
