class LogsController < ApplicationController

  def index
    @logs = Log.joins(:team, :message).eager_load(:mentor).order("logs.created_at DESC")
  end

  # Ajax処理
  def update
    puts :text => params
    @log = Log.find(params[:id])
    if @log.update(mentor_id: params[:mentor_id])
      status = 'success'
    else
      status = 'fail'
    end
    render json: {status: status, data: @log}
  end
end
