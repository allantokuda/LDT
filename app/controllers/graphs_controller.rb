class GraphsController < ApplicationController
  # GET /graphs
  # GET /graphs.json
  def index
    @graphs = Graph.all

    if @graphs.count > 0
      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @graphs }
      end
    else
      new
    end
  end

  # Calling this from frontend AJAX
  # GET /graphs/1
  # GET /graphs/1.json
  def show
    @graph = Graph.find_and_parse(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @graph }
    end
  end

  # GET /graphs/new
  # GET /graphs/new.json
  def new
    @graph = Graph.create

    respond_to do |format|
      format.html { redirect_to edit_graph_path(@graph.id) }
      format.json { render json: @graph }
    end
  end

  # GET /graphs/1/edit
  def edit
  end

  # POST /graphs
  # POST /graphs.json
  def create
    @graph = Graph.create_from_request params[:graph]

    respond_to do |format|
      if @graph
        format.html { redirect_to edit_graph_path(@graph.id), notice: 'Graph was successfully created.' }
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
    @graph.update_attributes_from_request(params[:graph])

    respond_to do |format|
      format.json { render :json => "OK" }
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
