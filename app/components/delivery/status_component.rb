# frozen_string_literal: true

class Delivery::StatusComponent < ViewComponent::Base
  def initialize(status:)
    @status = status
  end


end
