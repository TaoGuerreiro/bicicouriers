# frozen_string_literal: true

class Delivery::IndexComponent < ViewComponent::Base
  def initialize(deliveries:)
    @deliveries = deliveries
  end


end
