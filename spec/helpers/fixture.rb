class Fixture
  attr_reader :filename, :record_mode

  def initialize(filename, context, option=nil)
    @filename = filename
    @record_mode = ENV['RECORD_FIXTURE'] == 'on' # prefix rspec command with RECORD_FIXTURE=on to enable recording during test development
    @context = context # wherein an RSpec "expect" can be called
    @row = -1

    if record_mode
      clear_file
      puts "Writing new data to fixture file " + filename
    else
      read_file
    end
  end

  def next(data_row)
    @row += 1
    if record_mode
      write_line data_row
      puts data_row
      data_row
    else
      @context.expect(data_row).to(@context.eq(@data[@row]))
    end
  end

  private

  def clear_file
    File.open(filename, 'w') { |f| f.write nil }
  end

  def write_line(line)
    File.open(filename, 'a') { |f| f.write line + "\n" }
  end

  def read_file
    @data = File.read(filename).split("\n")
  end
end
