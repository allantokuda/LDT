worker_processes 2
preload_app true
GC.respond_to?(:copy_on_write_friendly=) and GC.copy_on_write_friendly = true
check_client_connection false
timeout 30

pid         "/home/ruby/ldt/shared/tmp/pids/unicorn.pid"
listen      "/home/ruby/ldt/shared/sockets/unicorn.sock", backlog: 6
stderr_path "/home/ruby/ldt/shared/log/unicorn.log"
stdout_path "/home/ruby/ldt/shared/log/unicorn.log"

# via http://unicorn.bogomips.org/Sandbox.html
# See section on BUNDLER_GEMFILE for Capistrano users
# We need this since we automatically run deploy:clean to
# cleanup old releases.
before_exec do |server|
 ENV["BUNDLE_GEMFILE"] = "/home/ruby/ldt/current/Gemfile"
end

before_fork do |server, worker|
 # When sent a USR2, Unicorn will suffix its pidfile with .oldbin and
 # immediately start loading up a new version of itself (loaded with a new
 # version of our app). When this new Unicorn is completely loaded
 # it will begin spawning workers. The first worker spawned will check to
 # see if an .oldbin pidfile exists. If so, this means we've just booted up
 # a new Unicorn and need to tell the old one that it can now die. To do so
 # we send it a QUIT.
 #
 # Using this method we get 0 downtime deploys.
 old_pid = '/home/ruby/ldt/shared/tmp/pids/unicorn.pid.oldbin'

 if File.exists?(old_pid) && server.pid != old_pid
   begin
     Process.kill("QUIT", File.read(old_pid).to_i)
   rescue Errno::ENOENT, Errno::ESRCH
     # someone else did our job for us
   end
 end

 defined?(ActiveRecord::Base) and ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
 Signal.trap 'TERM' do
   puts 'Unicorn worker intercepting TERM and doing nothing. Wait for master to sent QUIT'
 end

 # Unicorn master loads the app then forks off workers - because of the way
 # Unix forking works, we need to make sure we aren't using any of the parent's
 # sockets, e.g. db connection
 defined?(ActiveRecord::Base) and ActiveRecord::Base.establish_connection

 # Redis and Memcached would go here but their connections are established
 # on demand, so the master never opens a socket
 # $redis = Redis.connect
end
