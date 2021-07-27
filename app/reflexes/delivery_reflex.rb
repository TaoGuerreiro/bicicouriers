class DeliveryReflex < ApplicationReflex
  include Pundit
  include ApplicationHelper
  delegate :current_user, to: :connection
  before_reflex :build, except: [:new]
  after_reflex :morph_form, except: [:create]

  def new
    @delivery = Delivery.new
    @city = City.first

    @pickups = @delivery.pickups.build
    @drops = @delivery.drops.build

    @delivery.urgence = Urgence.find_by(name: 'Dans la journée')
    @delivery.volume = Volume.find_by(name: '- de 6 kilos')
  end

  def distance
    @delivery.user = User.first
    begin
      url = 'https://maps.googleapis.com/maps/api/directions/json?'
      query = {
        origin: @delivery.pickups.first.address,
        destination: @delivery.drops.first.address,
        mode: "walking",
        key: ENV['GOOGLE_API_KEY']
      }
      distance = JSON.parse(HTTParty.get(
        url,
        query: query
      ).body)
      @delivery.distance = (distance['routes'][0]['legs'][0]['distance']['value'])
      @delivery.tickets_distance = ((@delivery.distance / 1000) / 3.5).ceil
    rescue NoMethodError
     end
    end

  def urgence
  end

  def volume
  end

  def create
    current_user == String ? @user = current_user : @user = User.first
    @delivery.user = @user
    if @delivery.save
      send_notification(@delivery, params[:delivery][:email], params[:delivery][:phone])
      cable_ready.add_css_class(selector: '[id="form"]', name: 'hidden').broadcast
      # morph :nothing
    else
      morph "#delivery_form", render(Delivery::FormComponent.new(delivery: @delivery, city: @city))
      morph "#notifications", render(NotificationComponent.new(type: 'error', data: {timeout: 10, title: 'Petite erreur ?', body: "Il semblerait qu'il manque quelque chose.", countdown: true }))
    end
  end

  private

  def slack_message(delivery, phone, mail)
    {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Livraison pour *#{mail}* entre *#{delivery.pickups.first.start_hour}* et *#{delivery.pickups.first.end_hour}*"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "entre *#{delivery.pickups.first.address}* et *#{delivery.drops.first.address}*"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Détails : #{delivery.details}"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Téléphone : #{phone}"
          }
        }
      ]
    }
  end

  def send_notification(delivery, email, phone)
    #MAIL
    DispatchMailer.with(delivery: delivery, email: email, phone: phone).new_delivery.deliver_now
    #SLACK
    SendSlackNotificationJob.perform_now(slack_message(delivery, phone, email))
    #DOM
    morph "#notifications", render(NotificationComponent.new(type: 'success', data: {timeout: 10, title: 'Course enregistrée !', body: "Nous avons pris note de la livraison, s'il nous manque des détails, nous vous recontacterons.", countdown: true }))
  end

  def build
    @delivery = Delivery.new(delivery_params)
    @city = City.first
  end

  def morph_form
    morph "#delivery_form", render(Delivery::FormComponent.new(delivery: @delivery, city: @city))
  end

  def delivery_params
    params.require(:delivery).permit(:details, :distance, :tickets_distance, :user, :draft_id,
                                    :urgence_id, :volume_id, :phone, :email,
                                    drops_attributes:[:id, :date, :details, :address, :start_hour, :end_hour, :favorite_address],
                                    pickups_attributes:[:id, :details, :date, :address, :start_hour, :end_hour, :favorite_address],
                                    delivery_options_attributes:[ :option_id, :user_option])
  end
end
