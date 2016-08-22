class MessagesController < ApplicationController
  skip_before_action :logged_in?, only: [:ajax_create]
  def index
    @messages = Message.all
  end

  def new
    @message = Message.new
  end

  def create
    @message = Message.new(message_params)
    if @message.save
      redirect_to messages_path
    else
      render 'new'
    end
  end

  def edit
    @message = Message.find(params[:id])
  end

  def update
    @message = Message.find(params[:id])
    if @message.update(update_message_params)
      redirect_to messages_path
    else
      render edit_message_path(@message)
    end
  end

  # Ajax処理
  def ajax_create
    @message = Message.new(subscription: params[:subscription].strip_with_full_size_space)
    if @message.save
      status = 'success'
    else
      status = 'fail'
    end
      render json: {status: status, data: @message}
  end

  private

  def message_params
    params.require(:message).permit(:subscription)
  end

  def update_message_params
    params.require(:message).permit(:id, :subscription)
  end
end
