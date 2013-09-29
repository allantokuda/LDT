class GraphsController < ApplicationController

  before_filter :authorize, :only => [:create]
  before_filter :load_and_authorize_graph, :only => [:show, :update, :destroy]

  # GET /graphs
  # GET /graphs.json
  def index
    @graphs = Graph.where(:user_id => current_user_id)

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
    render json: @graph
  end

  # GET /graphs/new
  # GET /graphs/new.json
  def new
    @graph = Graph.create(:user_id => current_user_id)

    respond_to do |format|
      format.html { redirect_to edit_graph_path(@graph.string_id) }
      format.json { render json: @graph }
    end
  end

  # GET /graphs/1/edit
  def edit
  end

  # POST /graphs
  # POST /graphs.json
  def create
    if current_user_id
      user_params = params[:graph].merge({ :user_id => current_user_id })
      @graph = Graph.create_from_request user_params

      respond_to do |format|
        if @graph
          format.html { redirect_to edit_graph_path(@graph.string_id), notice: 'Graph was successfully created.' }
          format.json { render json: @graph, status: :created, location: @graph }
        else
          format.html { render action: "new" }
          format.json { render json: @graph.errors, status: :unprocessable_entity }
        end
      end
    else
      render :json => [], :status => :unauthorized
    end
  end

  # PUT /graphs/1
  # PUT /graphs/1.json
  def update
    @graph.update_attributes_from_request(params[:graph])
    render :json => "OK", :status => :ok
  end

  # DELETE /graphs/1
  # DELETE /graphs/1.json
  def destroy
    @graph.destroy

    respond_to do |format|
      format.html { redirect_to graphs_url }
      format.json { head :no_content }
    end
  end

  protected

  def current_user_id
    session[:user_id]
  end

  def authorize
    unless current_user_id
      render :json => [], :status => :unauthorized
    end
  end

  def load_and_authorize_graph
    if @graph = Graph.find_and_parse(params[:id])
      if @graph.user_id && @graph.user_id != current_user_id
        render :json => [], :status => :unauthorized
      end
    else
      render :json => [], :status => :not_found
    end
  end
end
