class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.integer :team_id, :null => false
      t.integer :message_id, :null => false
      t.integer :mentor_id
      t.integer :level

      t.timestamps null: false
    end
  end
end
