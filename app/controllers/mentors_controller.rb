class MentorsController < ApplicationController
  def index
    @mentors = Mentor.all
  end

  def new
    @mentor = Mentor.new
  end

  def create
    @mentor = Mentor.new(mentor_params)
    @mentor[:attend] = false
    if @mentor.save
      redirect_to mentors_path
    else
      render 'new'
    end
  end

  def edit
    @mentor = Mentor.find(params[:id])
  end

  def update
    @mentor = Mentor.find(params[:id])
    if @mentor.update(update_mentor_params)
      redirect_to mentors_path
    else
      render edit_mentor_path(@mentor)
    end
  end

  def attend
    @mentors = Mentor.all
  end

  def attend_update
    @mentor_attends = attend_params
    @mentor_attends.each do |mentor|
      update_mentor = Mentor.find(mentor[1][:id])
      update_mentor.update(attend: mentor[1][:attend])
    end
    redirect_to attend_path
  end

  # Ajax処理
  def ajax_get_src
    # メンターの画像ソースの変数を定義
    if File.exist?("#{Rails.root}/public/images/pokemon/mentor/#{params[:mentor_id].to_s}.png")
      src_mentor = "mentor/#{params[:mentor_id].to_s}.png"
    else
      src_mentor = "mentor/trainer.png"
    end
    render json: {src_mentor: src_mentor}
  end

  private

  def mentor_params
    params.require(:mentor).permit(:name, :subscription)
  end

  def update_mentor_params
    params.require(:mentor).permit(:id, :name, :subscription)
  end

  def attend_params
    params.require(:mentor)
  end
end
