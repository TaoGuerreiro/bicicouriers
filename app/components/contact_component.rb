class ContactComponent < ViewComponent::Base
  def initialize(contact:)
    @contact = contact
  end
end
