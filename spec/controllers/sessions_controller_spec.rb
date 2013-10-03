require 'spec_helper'

describe SessionsController do
  describe '#create' do
    context 'when assertion is valid' do
      before do
        User.stub(:create).and_return(double(nil, id: 123, email: 'user123@gmail.com'))

        controller.stub(:verify_persona).and_return({
          "audience"=>"http://localhost:3000",
          "expires"=>1380416382206,
          "issuer"=>"gmail.login.persona.org",
          "email"=>"user123@gmail.com",
          "status"=>"okay"
        })
      end

      it 'sets session user_id' do
        expect(session[:user_id]).to eq 123
      end

    end
  end
end
