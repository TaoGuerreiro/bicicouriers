class SendMessageToSlackCommerceJob < ApplicationJob
  queue_as :default

  def perform(text)
    return unless ENV['SLACK_COMMERCE_HOOK'].present?

    HTTParty.post(
      ENV['SLACK_COMMERCE_HOOK'],
      body: text.to_json,
      headers: { 'Content-Type' => 'application/json' }
    )
  end
end
