# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
#require 'rspec/rails'
require 'pry'
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

Capybara.app_host = 'http://localhost:3000'
Capybara.current_driver = :selenium
#Capybara.run_server = false
