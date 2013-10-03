LDS::Application.routes.draw do

  root :to => "graphs#new"
  resources :graphs, :except => :index

end
