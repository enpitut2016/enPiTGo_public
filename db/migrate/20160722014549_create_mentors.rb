class CreateMentors < ActiveRecord::Migration
  def change
    create_table :mentors do |t|
      t.string :name, :null => false
      t.boolean :attend, :null => false, :default => false
      t.text :subscription

      t.timestamps null: false
    end
  end
end
