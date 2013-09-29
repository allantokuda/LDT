class SessionsController < ApplicationController
  def create
    `curl -d "assertion=#{params[:assertion]}&audience=#{request.env['HTTP_ORIGIN']}" "https://verifier.login.persona.org/verify"`
    render json: 'OK'
  end

  def destroy
  end
end
