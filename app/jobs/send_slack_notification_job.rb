class SendSlackNotificationJob < ApplicationJob
  queue_as :default

  def perform(text)
    return unless ENV['SLACK_GENERAL_HOOK'].present?

    HTTParty.post(
      ENV['SLACK_GENERAL_HOOK'],
      body: text.to_json,
      headers: { 'Content-Type' => 'application/json' }
    )
  end
end
