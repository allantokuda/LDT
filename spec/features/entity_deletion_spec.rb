require 'spec_helper'

describe 'Entity deletion', js: true do
  it 'cascades to deleting all of its relationships' do
    visit '/'

    create_entity 100, 200
    create_entity 300, 200
    create_entity 200, 400

    create_relationship 0, 1
    create_relationship 1, 2
    create_relationship 2, 0

    delete_entity 2

    change_degree 0
    change_degree 1

    expect_arrowhead 0, 'M220,275m0,0 l10,0'
    expect_arrowhead 1, 'M300,275m0,0 l-10,0'

    expect(all('.click-area').count).to eq 2
  end
end
