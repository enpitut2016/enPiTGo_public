class Message < ActiveRecord::Base
  has_many :logs

  validates :subscription, presence: true, uniqueness: true
end
