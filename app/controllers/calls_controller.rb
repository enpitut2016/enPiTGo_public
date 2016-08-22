class CallsController < ApplicationController
  skip_before_action :logged_in?, only: [:new, :create]
  def new
    @mentors = Mentor.select(:id, :name, :subscription).where(attend: true)
    @logs = Log.joins(:team, :message).eager_load(:mentor).order("logs.created_at DESC")
  end

  def create
    @call = call_params
    @log = Log.new
    @log[:team_id] = @call[:team][:id]
    @log[:mentor_id] = @call[:mentor][:id]
    @log[:level] = @call[:level][:value]
    @log[:message_id] = @call[:message][:id]

    # テキストで入力されていたらそっちで更新
    msg = @call[:message][:subscription].strip_with_full_size_space
    if !msg.blank?
      if Message.exists?(:subscription => msg)
        @log[:message_id] = Message.find_by(:subscription => msg).id
      else
        # 登録されていないメッセージなので新規作成
        new_msg = Message.create(subscription: msg)
        @log[:message_id] = new_msg[:id]
      end
    end
    @log.save
    slack_message = make_slack_message(@log)
    Slack.chat_postMessage(text: slack_message, username: 'enPiTGo', channel: "#develop")

		# プッシュ通知用のJSON生成
		@mentors = Mentor.select(:id, :name).where(attend: true)

		if !@log.mentor.nil?
      @mentor_id = @log.mentor.id
		else
			@mentor_id = ''
    end

    # お困りごとの画像ソースの変数を定義
    if File.exist?("#{Rails.root}/public/images/pokemon/enemy/#{@log.message.id.to_s}.png")
      src_enemy = "enemy/#{@log.message.id.to_s}.png"
    else
      src_enemy = "enemy/unknown.png"
    end

    # メンターの画像ソースの変数を定義
    if File.exist?("#{Rails.root}/public/images/pokemon/mentor/#{@mentor_id.to_s}.png")
      src_mentor = "mentor/#{@mentor_id.to_s}.png"
    else
      src_mentor = "mentor/trainer.png"
    end


		data = {
      log_id: @log.id,
			team_name: @log.team.name,
      src_mentor: src_mentor,
      src_enemy: src_enemy,
			subscription: @log.message.subscription,
			level: @log.level.to_s,
			mentor_id: @mentor_id,
			mentors: @mentors
		 }
	 	# サーバからpokemon画面にプッシュ通知
		WebsocketRails[:call].trigger "pokemon", data

    redirect_to root_path, notice: 'メッセージが送信されました'
  end

  private
    def call_params
      params.require(:call).permit(
      team: [:id],
      message: [:id, :subscription],
      level: [:value],
      mentor: [:id]
      )
    end
end

#stringクラス拡張
class String
  def strip_with_full_size_space!
    s = "　\s\v"
    sub!(/^[#{s}]*([^#{s}]+)[#{s}]*$/o, '\1')
  end
  def strip_with_full_size_space
    clone.strip_with_full_size_space!
  end
end
