json.array!(@product_backlogs) do |product_backlog|
  json.extract! product_backlog, :id, :story_who, :story_what, :story_why, :create_user, :assign, :done_date, :done_user, :acceptance_criteria
  json.url product_backlog_url(product_backlog, format: :json)
end
