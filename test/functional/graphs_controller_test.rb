require 'test_helper'

class GraphsControllerTest < ActionController::TestCase
  setup do
    @graph = graphs(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:graphs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create graph" do
    assert_difference('Graph.count') do
      post :create, graph: { creation_date: @graph.creation_date, description: @graph.description, name: @graph.name, read_password: @graph.read_password, short_name: @graph.short_name, write_password: @graph.write_password }
    end

    assert_redirected_to graph_path(assigns(:graph))
  end

  test "should show graph" do
    get :show, id: @graph
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @graph
    assert_response :success
  end

  test "should update graph" do
    put :update, id: @graph, graph: { creation_date: @graph.creation_date, description: @graph.description, name: @graph.name, read_password: @graph.read_password, short_name: @graph.short_name, write_password: @graph.write_password }
    assert_redirected_to graph_path(assigns(:graph))
  end

  test "should destroy graph" do
    assert_difference('Graph.count', -1) do
      delete :destroy, id: @graph
    end

    assert_redirected_to graphs_path
  end
end
