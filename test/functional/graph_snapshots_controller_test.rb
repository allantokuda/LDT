require 'test_helper'

class GraphSnapshotsControllerTest < ActionController::TestCase
  setup do
    @graph_snapshot = graph_snapshots(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:graph_snapshots)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create graph_snapshot" do
    assert_difference('GraphSnapshot.count') do
      post :create, graph_snapshot: { modification_date: @graph_snapshot.modification_date, notes: @graph_snapshot.notes, tag: @graph_snapshot.tag }
    end

    assert_redirected_to graph_snapshot_path(assigns(:graph_snapshot))
  end

  test "should show graph_snapshot" do
    get :show, id: @graph_snapshot
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @graph_snapshot
    assert_response :success
  end

  test "should update graph_snapshot" do
    put :update, id: @graph_snapshot, graph_snapshot: { modification_date: @graph_snapshot.modification_date, notes: @graph_snapshot.notes, tag: @graph_snapshot.tag }
    assert_redirected_to graph_snapshot_path(assigns(:graph_snapshot))
  end

  test "should destroy graph_snapshot" do
    assert_difference('GraphSnapshot.count', -1) do
      delete :destroy, id: @graph_snapshot
    end

    assert_redirected_to graph_snapshots_path
  end
end
