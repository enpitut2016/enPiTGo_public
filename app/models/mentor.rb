class Mentor < ActiveRecord::Base
  has_many :logs

  validates :name, presence: true, uniqueness: true
  validates :attend, inclusion: {in: [true, false]}
end
