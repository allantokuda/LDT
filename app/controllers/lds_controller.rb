class LdsController < ApplicationController
  # GET /edit
  def edit
    @entities = Entity.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @entities }
    end
  end

  def new
  end

  def open
  end

  def save
  end

  def delete
  end
end
