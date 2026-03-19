Rails.application.routes.draw do
  root "albums#index"

  resources :libraries, only: %i[index new create destroy]

  resources :albums, only: %i[index show create], param: :external_id do
    resource :tracks, only: :update, module: :albums
  end

  get "up" => "rails/health#show", as: :rails_health_check

  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
