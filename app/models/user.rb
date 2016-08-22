class User < ActiveRecord::Base
  validates :name, presence: true
  has_secure_password
  validates :password, presence: true
end
