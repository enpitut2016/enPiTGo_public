class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper
  # ログインのチェック
  before_action :logged_in?

  def make_slack_message(log)
    msg = ""
    msg += ':mega:' + log.team.name + ' '
    msg += ':speech_balloon:' + log.message.subscription + ' '
    if !log.mentor.nil?
      msg += ':information_desk_person:' + log.mentor.name
    end
    msg += '[ふんいき]'
    case log.level
    when 1 then
      msg += ':confused:'
    when 2 then
      msg += ':cry:'
    when 3 then
      msg += ':sob:'
    else
      msg += ':cry:'
    end
    return msg
  end
end
