class ProductBacklogsController < ApplicationController
  before_action :set_product_backlog, only: [:show, :edit, :update, :destroy]

  # GET /product_backlogs
  # GET /product_backlogs.json
  def index
    @product_backlogs = ProductBacklog.all
  end

  # GET /product_backlogs/1
  # GET /product_backlogs/1.json
  def show
  end

  # GET /product_backlogs/new
  def new
    @product_backlog = ProductBacklog.new
  end

  # GET /product_backlogs/1/edit
  def edit
  end

  # POST /product_backlogs
  # POST /product_backlogs.json
  def create
    @product_backlog = ProductBacklog.new(product_backlog_params)

    respond_to do |format|
      if @product_backlog.save
        format.html { redirect_to @product_backlog, notice: 'Product backlog was successfully created.' }
        format.json { render :show, status: :created, location: @product_backlog }
      else
        format.html { render :new }
        format.json { render json: @product_backlog.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /product_backlogs/1
  # PATCH/PUT /product_backlogs/1.json
  def update
    respond_to do |format|
      if @product_backlog.update(product_backlog_params)
        format.html { redirect_to @product_backlog, notice: 'Product backlog was successfully updated.' }
        format.json { render :show, status: :ok, location: @product_backlog }
      else
        format.html { render :edit }
        format.json { render json: @product_backlog.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /product_backlogs/1
  # DELETE /product_backlogs/1.json
  def destroy
    @product_backlog.destroy
    respond_to do |format|
      format.html { redirect_to product_backlogs_url, notice: 'Product backlog was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product_backlog
      @product_backlog = ProductBacklog.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def product_backlog_params
      params.require(:product_backlog).permit(:priority, :story_who, :story_what, :story_why, :create_user, :assign, :done_date, :done_user, :acceptance_criteria)
    end
end
