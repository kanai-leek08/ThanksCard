class ProductBacklogsController < ApplicationController
  before_action :set_product_backlog, only: [:show, :edit, :update, :destroy]

  # GET /product_backlogs
  # GET /product_backlogs.json
  def index
    @product_backlogs = ProductBacklog.all
    priorities = Priority.select(:priority_sort)
    # プロダクトバックログを優先順位で並べ替える
    @product_backlogs = priorities[0].priority_sort.split(",").collect {|id| @product_backlogs.detect {|x| x.id == id.to_i}}
    # 存在しないPBLのIDは削除　
    @product_backlogs.compact!
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

        #新しく追加したIDをsortの一番下に追加 TODO 複数プロダクト対応の際に見直し　
        last_insert_id = ProductBacklog.last.id.to_s
        priority = Priority.last
        priority.update({:priority_sort => priority.priority_sort + ',' + last_insert_id})

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

  # 優先順位を更新する
  def updatePriority
    #TODO 複数Productに対応する。一旦 delete insert
    Priority.delete_all()
    priority = Priority.new({"priority_sort" => params[:ids].join(",")})
    priority.save
    respond_to do |format|
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
      params.require(:product_backlog).permit(:story_who, :story_what, :story_why, :create_user, :assign, :done_date, :done_user, :acceptance_criteria)
    end

end
