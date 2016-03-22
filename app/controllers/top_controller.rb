class TopController < ApplicationController
  def index
    render :file => 'public/idx.html'
  end
end
