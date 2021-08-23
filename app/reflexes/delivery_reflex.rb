class DeliveryReflex < ApplicationReflex
  include Pundit
  include ApplicationHelper
  delegate :current_user, to: :connection
  before_reflex :build, except: [:new]
  after_reflex :morph_form, except: [:create]

  def new
    @delivery = build_a_new_delivery
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
      @delivery.tickets_count += @delivery.tickets_distance
    rescue NoMethodError
     end
  end

  def urgence

  end

  def volume
  end

  def create
    current_user == String ? @user = current_user : @user = User.first #Need to create Guest model
    @delivery.user = @user
    if @delivery.save
      send_notifications(@delivery, params[:delivery][:email], params[:delivery][:phone])
      cable_ready.add_css_class(selector: '[id="form"]', name: 'hidden').broadcast
    else
      morph "#delivery_form", render(Delivery::FormComponent.new(delivery: @delivery, city: @city))
      morph "#notifications", render(NotificationComponent.new(type: 'error', data: {timeout: 10, title: 'Petite erreur ?', body: "Il semblerait qu'il manque quelque chose.", countdown: true }))
    end
  end

  def create_online
    @delivery.user = current_user
    if current_user.have_remaining_tickets?
      #-> Si l'user n'a pas assez de tickets
      if @delivery.tickets_count > current_user.remaining_tickets
        # morph un truc pour expliquer qu'il faut racheter un carnet avant de continuer
      else
        @tickets_book = current_user.last_availible_tickets_book
        #-> Si il reste des tickets dans le dernier carnet mais pas assez pour la livraison
        if @tickets_book.remaining_tickets < @delivery.tickets_count
          @next_ticket_book = current_user.next_availible_tickets_book # -> prochain carnet plein
          report = @delivery.tickets_count - @tickets_book.remaining_tickets # -> ticket à reporter sur le prochain carnet
          @tickets_book.remaining_tickets = 0 # -> on passe l'ancien carnet à 0
          @next_ticket_book.remaining_tickets -= (@delivery.tickets_count - report) # -> on soustrait le repot au nouveau carnet
          @next_ticket_book.save
          @tickets_book.save
          # GERER LE FAIT QU'UNE LIVRAISON SOIT SUPERIEUR à UN CARNET ENTIER ?
        else
          @tickets_book.remaining_tickets -= @delivery.tickets_count
          @tickets_book.save
        end
      end
    else
      #-> User n'a pas/plus de ticket
      # morph un truc pour expliquer qu'il faut racheter un carnet avant de continuer
  end
  # binding.pry
  @delivery.price_cents = (@delivery.tickets_count * current_user.last_availible_tickets_book.book_template.price_cents)
    if @delivery.save
      @delivery = build_a_new_delivery
      send_notifications(@delivery, current_user.email , current_user.phone)
      morph "#delivery_form", render(Delivery::AppFormComponent.new(delivery: @delivery, city: @city, user: current_user))
    else
      morph "#delivery_form", render(Delivery::AppFormComponent.new(delivery: @delivery, city: @city, user: current_user))
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

  def send_notifications(delivery, email, phone)
    #DOM
    morph "#notifications", render(NotificationComponent.new(type: 'success', data: {timeout: 10, title: 'Course enregistrée !', body: "Nous avons pris note de la livraison, s'il nous manque des détails, nous vous recontacterons.", countdown: true }))
    #SLACK
    SendSlackNotificationJob.perform_now(slack_message(delivery, phone, email))
    #MAIL
    # DispatchMailer.with(delivery: delivery, email: email, phone: phone).new_delivery.deliver_now
  end

  def build
    @delivery = Delivery.new(delivery_params)
    @city = City.first
    @user = current_user
  end

  def morph_form
    @delivery.tickets_count = @delivery.urgence.tickets + @delivery.volume.tickets + @delivery.tickets_distance
    if params[:controller] == 'pages'
      morph "#delivery_form", render(Delivery::FormComponent.new(delivery: @delivery, city: @city))
    else
      morph "#delivery_form", render(Delivery::AppFormComponent.new(delivery: @delivery, city: @city, user: @user))
    end
  end

  def build_a_new_delivery
    @delivery = Delivery.new
    @city = City.first

    @pickups = @delivery.pickups.build
    @drops = @delivery.drops.build

    @delivery.urgence = Urgence.find_by(name: 'Dans la journée')
    @delivery.volume = Volume.find_by(name: '- de 6 kilos')
    return @delivery
  end


  #__________PARAMS____________

  def delivery_params
    params.require(:delivery).permit(:details, :distance, :tickets_distance, :tickets_count, :user, :draft_id,
                                    :urgence_id, :volume_id, :phone, :email,
                                    drops_attributes:[:id, :date, :details, :address, :start_hour, :end_hour, :favorite_address],
                                    pickups_attributes:[:id, :details, :date, :address, :start_hour, :end_hour, :favorite_address],
                                    delivery_options_attributes:[ :option_id, :user_option])
  end

end
