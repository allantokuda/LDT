source 'https://rubygems.org'
ruby "1.9.3"

gem 'rails', '3.2.9'

group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'uglifier', '>= 1.0.3'
  gem 'jquery-rails'
  gem 'jquery-ui-rails', :git => 'https://github.com/joliss/jquery-ui-rails'
  gem 'underscore-rails'
end

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
  gem 'zeus'
  gem 'guard'
  gem 'guard-rspec'
  gem 'guard-zeus'
end

group :development do
  # Needed to expose generators and rake tasks
  gem 'rspec-rails', '~> 2.0'
  gem 'debugger', '~> 1.3.3'
end

group :test do
  gem 'rspec-rails', '~> 2.0'
  gem 'cucumber-rails', :require => false
  gem 'database_cleaner'
  gem 'launchy'
end
