class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|
      t.string :body
      t.string :fromUser
      t.string :toUser

      t.timestamps null: false
    end
  end
end
