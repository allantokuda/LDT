source 'https://rubygems.org'
ruby "2.1.2"

gem 'rails', '4.0.1'

gem 'sass-rails'
gem 'coffee-rails'
gem 'uglifier', '>= 1.0.3'
gem 'underscore-rails'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

gem 'execjs'
gem 'therubyracer'
gem 'libv8', '~> 3.11.8'
gem 'pg'
gem "haml", "~> 3.1.7"
gem "haml-rails"

group :development, :test do
  gem 'pry'
	gem 'rspec', '~> 3.1' # need 3.1 for :have_attributes matcher
  # gem 'zeus'
  # gem 'guard'
  # gem 'guard-rspec'
  # gem 'guard-zeus'
  # Needed to expose generators and rake tasks
  gem 'capybara'
  gem 'selenium-webdriver'
  gem 'geckodriver-helper'
end

group :development do
  gem 'puma'
end

group :test do
  gem 'cucumber-rails', :require => false
  gem 'database_cleaner'
  gem 'launchy'
end

gem 'unicorn-rails'

gem 'capistrano'
gem 'capistrano-rvm',      require: false;
gem 'capistrano-rails',    require: false;
gem 'capistrano-bundler',  require: false;
gem 'capistrano3-unicorn', require: false;




