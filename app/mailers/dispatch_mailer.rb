class DispatchMailer < ApplicationMailer

  def new_delivery
    @email = params[:delivery][:email]
    @phone = params[:delivery][:phone]
    @delivery = params[:delivery]
    mail(to: 'contact@bicicouriers.fr', subject: "Nouvelle course")
  end

end
