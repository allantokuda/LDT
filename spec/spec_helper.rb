ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'pry'
require 'capybara/rails'
require 'capybara/rspec'
require_relative 'helpers/graph_editor_helper'
require_relative 'helpers/fixture'
require_relative 'helpers/custom_matchers'
require_relative 'helpers/capybara_element_helper'

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

RSpec.configure do |config|
	config.include Capybara::DSL
  config.order = "random"
end

Capybara.server = :puma
Capybara.app_host = 'http://localhost:3000'
Capybara.javascript_driver = :selenium_chrome

