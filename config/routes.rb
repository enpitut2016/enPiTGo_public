Rails.application.routes.draw do

  root 'calls#new'
  get 'pokemon', to: 'pokemons#index'

  resources :teams
  resources :mentors
  resources :messages
  resources :logs
  get 'attend', to: 'mentors#attend'
  post 'attend', to: 'mentors#attend_update'
  get 'call', to: 'calls#new'
  post 'call', to: 'calls#create'
  # Ajax系処理
  post 'new_message_ajax', to: 'messages#ajax_create'
  get 'get_mentor_src_ajax', to: 'mentors#ajax_get_src'

  get 'index', to: 'pokemons#index'

  get    'login'   => 'sessions#new'
  post   'login'   => 'sessions#create'
end
