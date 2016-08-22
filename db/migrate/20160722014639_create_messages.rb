class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :subscription, :null => false

      t.timestamps null: false
    end
  end
end
