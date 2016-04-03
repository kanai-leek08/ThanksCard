require 'test_helper'

class ProductBacklogsControllerTest < ActionController::TestCase
  setup do
    @product_backlog = product_backlogs(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:product_backlogs)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create product_backlog" do
    assert_difference('ProductBacklog.count') do
      post :create, product_backlog: { acceptance_criteria: @product_backlog.acceptance_criteria, assign: @product_backlog.assign, create_user: @product_backlog.create_user, done_date: @product_backlog.done_date, done_user: @product_backlog.done_user, priority: @product_backlog.priority, story_what: @product_backlog.story_what, story_who: @product_backlog.story_who, story_why: @product_backlog.story_why }
    end

    assert_redirected_to product_backlog_path(assigns(:product_backlog))
  end

  test "should show product_backlog" do
    get :show, id: @product_backlog
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @product_backlog
    assert_response :success
  end

  test "should update product_backlog" do
    patch :update, id: @product_backlog, product_backlog: { acceptance_criteria: @product_backlog.acceptance_criteria, assign: @product_backlog.assign, create_user: @product_backlog.create_user, done_date: @product_backlog.done_date, done_user: @product_backlog.done_user, priority: @product_backlog.priority, story_what: @product_backlog.story_what, story_who: @product_backlog.story_who, story_why: @product_backlog.story_why }
    assert_redirected_to product_backlog_path(assigns(:product_backlog))
  end

  test "should destroy product_backlog" do
    assert_difference('ProductBacklog.count', -1) do
      delete :destroy, id: @product_backlog
    end

    assert_redirected_to product_backlogs_path
  end
end
