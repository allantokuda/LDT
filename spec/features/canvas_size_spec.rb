require 'spec_helper'

describe 'Canvas', js: true do
  it 'resizes to match the window size' do
    visit '/'

    # wide enough to have just one row of toolbar buttons
    window_size 1300, 800
    find('#svg-paths').click

    w = find('#svg-paths').native.style(:width ).to_i
    h = find('#svg-paths').native.style(:height).to_i

    # Express approximate correct width/height here to make it less sensitive to style and layout details
    expect(w).to be > 1200
    expect(w).to be < 1400

    # Actually pretty short (~664px) because of "Chrome is being controlled by automated test software" indicator
    expect(h).to be > 650
    expect(h).to be < 680

    window_size 1400, 900
    find('#svg-paths').click

    expect(find('#svg-paths').native.style(:width ).to_i).to eq(w+100)
    expect(find('#svg-paths').native.style(:height).to_i).to eq(h+100)

    window_size 1250, 750
    find('#svg-paths').click

    expect(find('#svg-paths').native.style(:width ).to_i).to eq(w-50)
    expect(find('#svg-paths').native.style(:height).to_i).to eq(h-50)
  end

  it 'is wide and tall enough to encompass everything in the graph' do
    visit '/'

    # wide enough to have just one row of toolbar buttons
    window_size 1200, 1000

    create_entity 200, 200
    6.times { find('#canvas').drag(-300, -300) }
    create_entity(200, 200)
    6.times { find('#canvas').drag(300, 300) }

    w = find('#svg-paths').native.style(:width ).to_i
    h = find('#svg-paths').native.style(:height).to_i

    expect(find('#svg-paths')).to have_approx_size({ width: w, height: h, tolerance: 100 })

    expect(w).to be > 1900
    expect(h).to be > 1900

    save
    refresh

    expect(find('#svg-paths')).to have_approx_size({ width: w, height: w, tolerance: 100 })
  end
end

