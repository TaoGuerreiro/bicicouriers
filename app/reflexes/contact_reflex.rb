class ContactReflex < ApplicationReflex

  def create
    # binding.pry
    @contact = Contact.new(contact_params)
    @contact.city = City.first
    if @contact.save
      morph "#notifications", render(NotificationComponent.new(type: 'success', data: {timeout: 10, title: 'Message reçu !', body: "Nous avons pris note de votre message, s'il nous manque des détails, nous vous recontacterons.", countdown: true }))
      morph "#contact_form", render(ContactComponent.new(contact: Contact.new))
      SendMessageToSlackAdminJob.perform_now(slack_message(@contact))
    else
      morph "#contact_form", render(ContactComponent.new(contact: @contact))
      morph "#notifications", render(NotificationComponent.new(type: 'error', data: {timeout: 10, title: 'Oups !', body: "Il manque quelque chose...", countdown: true }))
    end
  end


  private

  def slack_message(contact)
    {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Nouveau message de #{contact.name}*"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "#{contact.message}"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "#{contact.phone}"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "#{contact.email}"
          }
        }
      ]
    }

  end

  def contact_params
    params.require(:contact).permit(:name, :email, :phone, :message, :nickname)
  end

end
