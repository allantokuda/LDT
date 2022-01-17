Capybara::Node::Element.class_eval do
  def element_center
    driver.browser.action.tap { |builder| builder.default_move_duration = 0 }.move_to(native)
  end

  # double click center of element
  def double_click
    element_center.double_click.perform
  end

  # Input: page X and Y coordinates.
  # Output: coordinates with respect to center of element
  def relative_coordinates(x, y)
    element_center.move_by(
      (x - (native.size.width  / 2)).to_i,
      (y - (native.size.height / 2)).to_i
    )
  end

  # drag click at x, y location relative to upper left corner
  def click_at(x, y)
    relative_coordinates(x, y).click.perform
  end

  # drag from x, y location relative to upper left corner, by distance dx, dy
  def drag_at(x, y, dx, dy)
    relative_coordinates(x, y).click_and_hold.move_by(dx, dy).release.perform
  end

  # drag from middle of element, by distance dx, dy
  def drag(dx, dy)
    element_center.click_and_hold.move_by(dx, dy).release.perform
  end
end
