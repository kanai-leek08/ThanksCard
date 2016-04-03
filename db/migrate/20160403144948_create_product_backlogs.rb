class CreateProductBacklogs < ActiveRecord::Migration
  def change
    create_table :product_backlogs do |t|
      t.integer :priority
      t.string :story_who
      t.string :story_what
      t.string :story_why
      t.string :create_user
      t.string :assign
      t.date :done_date
      t.string :done_user
      t.text :acceptance_criteria

      t.timestamps null: false
    end
  end
end
