class LdsController < ApplicationController

  # GET /edit
  def edit
    @entities = Entity.all

    respond_to do |format|
      format.html # edit.html.erb
      format.json { render json: @entities }
    end
  end

  def example
    self.edit
  end

  def new
  end

  def open
  end

  def save
    @entities = Entity.all

    @lds = JSON.parse(params[:lds], :symbolize_names => true)
    puts ">>>>>>> DEBUG"
    puts "Entities:"
    puts @lds[:entities]
    puts "Relationships:"
    puts @lds[:relationships]
    puts "<<<<<<< DEBUG"

    @lds[:entities].each { |e|
      Entity.find(e[:id]).update_attributes(
        :name   => e[:name],
        :x      => e[:x],
        :y      => e[:y],
        :width  => e[:width],
        :height => e[:height],
        :attrib => e[:attrib]
      )
    }

    respond_to do |format|
      format.html { render :html => "OK" }
    end
  end

  def delete
  end
end
