class AddColumnToCards < ActiveRecord::Migration
  def change
    add_column :cards, :title, :string
    add_column :cards, :count, :integer
  end
end
