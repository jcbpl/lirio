Rails.application.routes.draw do
  root "albums#index"

  resources :libraries, only: %i[index new create destroy]

  resources :albums, only: %i[index show create], param: :external_id do
    resource :tracks, only: :update, module: :albums
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
