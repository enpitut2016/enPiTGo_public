class SessionsController < ApplicationController
  skip_before_action :logged_in?, only: [:new, :create]
  def new
  end

  def create
    user = User.find_by(name: params[:session][:name])
    if user && user.authenticate(params[:session][:password])
      log_in user
      redirect_to mentors_path, notice: 'Logged in.'
    else
      redirect_to root_path, alert: 'You are not mentor. Thank you.'
    end
  end
end
