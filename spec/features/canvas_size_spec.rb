require 'spec_helper'

describe 'Canvas', js: true do
  it 'resizes to match the window size' do
    visit '/'

    window_size 500, 500
    find('#svg-paths').click

    w = find('#svg-paths').native.style(:width ).to_i
    h = find('#svg-paths').native.style(:height).to_i

    # Express approximate correct width here to make it less sensitive to style and layout details
    expect(w).to be > 400
    expect(h).to be > 400
    expect(w).to be < 600
    expect(h).to be < 600

    # Increase width and height by 100px
    window_size 600, 600
    find('#svg-paths').click

    # Expect SVG width to update by the same amount
    expect(find('#svg-paths').native.style(:width ).to_i).to eq(w+100)
    expect(find('#svg-paths').native.style(:height).to_i).to eq(h+100)

    # Increase width and height by 100px
    window_size 450, 450
    find('#svg-paths').click

    # Expect SVG width to update by the same amount
    expect(find('#svg-paths').native.style(:width ).to_i).to eq(w-50)
    expect(find('#svg-paths').native.style(:height).to_i).to eq(h-50)
  end

  it 'is wide and tall enough to encompass everything in the graph' do
    visit '/'

    create_entity   20,   20
    create_entity 2000, 2000

    w = find('#svg-paths').native.style(:width ).to_i
    h = find('#svg-paths').native.style(:height).to_i

    expect(find('#svg-paths')).to have_approx_size({ width: w+100, height: w+130, tolerance: 100 })

    expect(w).to be > 1900
    expect(h).to be > 1900

    create_entity 2100, 2100

    expect(find('#svg-paths').native.style(:width ).to_i).to eq(w+100)
    expect(find('#svg-paths').native.style(:height).to_i).to eq(h+100)

    save
    refresh

    expect(find('#svg-paths')).to have_approx_size({ width: w+200, height: w+230, tolerance: 100 })
  end
end

