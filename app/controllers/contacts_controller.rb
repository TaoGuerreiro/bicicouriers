class ContactsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:new, :create, :simulation]

  def new
    @contact ||= Contact.new
  end
end
