class TeamsController < ApplicationController
  def index
    @teams = Team.all
  end

  def new
    @team = Team.new
  end

  def create
    @team = Team.new(team_params)
    if @team.save
      redirect_to teams_path
    else
      render 'new'
    end
  end

  def edit
    @team = Team.find(params[:id])
  end

  def update
    @team = Team.find(params[:id])
    if @team.update(update_team_params)
      redirect_to teams_path
    else
      render edit_team_path(@team)
    end
  end

  private

  def team_params
    params.require(:team).permit(:name)
  end

  def update_team_params
    params.require(:team).permit(:id, :name)
  end
end
