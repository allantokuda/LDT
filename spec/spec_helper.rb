# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
#require 'rspec/rails'
require 'pry'

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

RSpec.configure do |config|
	config.include Capybara::DSL
  config.order = "random"
end

Capybara.app_host = 'http://localhost:3000'
Capybara.current_driver = :selenium
#Capybara.run_server = false

Capybara::Node::Element.class_eval do
  def click_at(x, y)
    left = x - (native.size.width  / 2)
    top  = y - (native.size.height / 2)
    driver.browser.action.move_to(native).move_by(left.to_i, top.to_i).click.perform
  end

  def double_click
    driver.browser.mouse.double_click(native)
  end

  def drag(dx, dy)
    driver.browser.action.move_to(native).click_and_hold.move_by(dx.to_i, dy.to_i).release.perform
  end
end

# Usage: expect(target).to respond(to: [:chain_method1, :chain_method2, ...], with: expected_value)
RSpec::Matchers.define :respond do |behavior|
  match do |element|
		# Run all the methods in [:to] in sequence, and compare the final result to expected_value
		behavior[:to].inject(element) { |object, method| object.send method } == behavior[:with]
  end

	failure_message do |element|
    %Q(expected: #{behavior[:with].inspect}\n) +
		%Q(actual:   #{behavior[:to].inject(element) { |object, method| object.send method }.inspect})
  end
end

RSpec::Matchers.define :have_svg_path_data do |expected_d|
  match do |element|
    element[:d] == expected_d
  end
	failure_message do |element|
    %Q(expected: <path d="#{expected_d}">\n) +
		%Q(actual:   <path d="#{element[:d]}">)
  end
end
