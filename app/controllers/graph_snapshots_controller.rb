class GraphSnapshotsController < ApplicationController
  # GET /graph_snapshots
  # GET /graph_snapshots.json
  def index
    @graph_snapshots = GraphSnapshot.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @graph_snapshots }
    end
  end

  # GET /graph_snapshots/1
  # GET /graph_snapshots/1.json
  def show
    @graph_snapshot = GraphSnapshot.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @graph_snapshot }
    end
  end

  # GET /graph_snapshots/new
  # GET /graph_snapshots/new.json
  def new
    @graph_snapshot = GraphSnapshot.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @graph_snapshot }
    end
  end

  # GET /graph_snapshots/1/edit
  def edit
    @graph_snapshot = GraphSnapshot.find(params[:id])
  end

  # POST /graph_snapshots
  # POST /graph_snapshots.json
  def create
    @graph_snapshot = GraphSnapshot.new(params[:graph_snapshot])

    respond_to do |format|
      if @graph_snapshot.save
        format.html { redirect_to @graph_snapshot, notice: 'Graph snapshot was successfully created.' }
        format.json { render json: @graph_snapshot, status: :created, location: @graph_snapshot }
      else
        format.html { render action: "new" }
        format.json { render json: @graph_snapshot.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /graph_snapshots/1
  # PUT /graph_snapshots/1.json
  def update
    @graph_snapshot = GraphSnapshot.find(params[:id])

    respond_to do |format|
      if @graph_snapshot.update_attributes(params[:graph_snapshot])
        format.html { redirect_to @graph_snapshot, notice: 'Graph snapshot was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @graph_snapshot.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /graph_snapshots/1
  # DELETE /graph_snapshots/1.json
  def destroy
    @graph_snapshot = GraphSnapshot.find(params[:id])
    @graph_snapshot.destroy

    respond_to do |format|
      format.html { redirect_to graph_snapshots_url }
      format.json { head :no_content }
    end
  end
end
