class Team < ActiveRecord::Base
  has_many :logs

  validates :name, presence: true, uniqueness: true
end
