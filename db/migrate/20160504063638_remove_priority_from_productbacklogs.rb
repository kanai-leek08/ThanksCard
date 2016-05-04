class RemovePriorityFromProductbacklogs < ActiveRecord::Migration
  def change
    remove_column :product_backlogs, :priority
  end
end
