class Track < ApplicationRecord
  belongs_to :album

  validates :external_id, presence: true, uniqueness: { scope: :album_id }
  validates :title, presence: true
end
