#json.extract! @card, :id, :title, :body, :fromUser, :toUser, :count, :created_at, :updated_at
json.merge! @card.attributes
