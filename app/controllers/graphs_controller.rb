class GraphsController < ApplicationController
  # GET /graphs
  # GET /graphs.json
  def index
    @graphs = Graph.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @graphs }
    end
  end

  # GET /graphs/1
  # GET /graphs/1.json
  def show
    @graph = Graph.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @graph }
    end
  end

  # GET /graphs/new
  # GET /graphs/new.json
  def new
    @graph = Graph.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @graph }
    end
  end

  # GET /graphs/1/edit
  def edit
    if params[:id]
      @graph = Graph.find(params[:id])
    else
      @graph = Graph.new
      @graph.save
    end
  end

  # POST /graphs
  # POST /graphs.json
  def create
    @graph = Graph.new(params[:graph])

    respond_to do |format|
      if @graph.save
        format.html { redirect_to @graph, notice: 'Graph was successfully created.' }
        format.json { render json: @graph, status: :created, location: @graph }
      else
        format.html { render action: "new" }
        format.json { render json: @graph.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /graphs/1
  # PUT /graphs/1.json
  def update
    @graph = Graph.find(params[:id])

    newgraph = JSON.parse(params[:graph], :symbolize_names => true)

    newgraph[:entities].each do |e|
      Entity.update_from_hash(e)
    end

    respond_to do |format|
      format.html { render :json => "OK" }
      format.html { render :html => "OK" }
    end
  end

  # DELETE /graphs/1
  # DELETE /graphs/1.json
  def destroy
    @graph = Graph.find(params[:id])
    @graph.destroy

    respond_to do |format|
      format.html { redirect_to graphs_url }
      format.json { head :no_content }
    end
  end
end
