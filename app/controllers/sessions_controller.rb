class SessionsController < ApplicationController
  def create
    response = `curl -d "assertion=#{params[:assertion]}&audience=#{request.env['HTTP_ORIGIN']}" "https://verifier.login.persona.org/verify"`
    session[:user]


#{"audience"=>"http://localhost:3000",
# "expires"=>1380416382206,
# "issuer"=>"gmail.login.persona.org",
# "email"=>"praetis@gmail.com",
# "status"=>"okay"}
    render :json => [], :status => :ok
  end

  def destroy
    render :json => [], :status => :ok
  end
end
