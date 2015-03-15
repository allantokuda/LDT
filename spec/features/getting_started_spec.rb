require 'spec_helper'

describe 'Getting started tooltips', js: true do
  it 'displays when there are no entities, then hides when you create one' do
    visit '/'

    expect(find('.getting-started')).to have_content 'Click here'

    create_entity 100, 200

    # the call to "all" below doesn't wait for the condition to be true,
    # so just to be safe, wait a little bit for the popup to go away
    sleep 0.1

    expect(all('.getting-started').count).to eq 0
  end
end
