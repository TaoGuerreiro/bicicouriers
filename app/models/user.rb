class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :tickets_books, dependent: :destroy
  has_many :deliveries, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :user_options, dependent: :destroy
  has_many :favorite_addresses, dependent: :destroy

  validates :email, presence: true
  validates :phone, presence: true

  def remaining_tickets
    self.tickets_books.sum(:remaining_tickets)
  end

  def have_remaining_tickets?
    self.tickets_books.sum(:remaining_tickets).positive?
  end

  def last_availible_tickets_book
    self.tickets_books.where('remaining_tickets > ?', 0).first
  end
  def next_availible_tickets_book
    self.tickets_books.where('remaining_tickets > ?', 0).second
  end

  # after_create :send_welcome_email

  private

  def send_welcome_email
    UserMailer.with(user: self).welcome.deliver_now
  end

end
