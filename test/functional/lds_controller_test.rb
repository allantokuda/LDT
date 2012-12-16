require 'test_helper'

class LdsControllerTest < ActionController::TestCase
  test "should get new" do
    get :new
    assert_response :success
  end

  test "should get open" do
    get :open
    assert_response :success
  end

  test "should get save" do
    get :save
    assert_response :success
  end

  test "should get delete" do
    get :delete
    assert_response :success
  end

end
