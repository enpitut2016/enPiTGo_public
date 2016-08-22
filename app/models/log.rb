class Log < ActiveRecord::Base
  belongs_to :mentor
  belongs_to :message
  belongs_to :team

  validates :team_id, presence: true
  validates :message_id, presence: true
end
