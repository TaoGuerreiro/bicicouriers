class ContactsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:new, :create, :simulation]

  def new
    @contact = Contact.new
  end



  def create
    # raise
    @contact = Contact.new(contact_params)
    @contact.city = City.first
    if @contact.save
        redirect_to root_path, flash: {notice: 'Merci pour le message, on vous recontacte rapidement !'}
        SendSlackNotificationJob.perform_now("test")
    else
      render :new, flash: {error: 'Il doit y avoir un soucis dans le formulaire !'}
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :phone, :message, :nickname)
  end

end
