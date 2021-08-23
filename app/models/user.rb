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

  def total_current_books_tickets # la sommes des tickets possible dans les carnets commencer : ex 12/50 + 100/100 = 150
    self.tickets_books.includes(:book_template).where('remaining_tickets > ?',0).sum('book_templates.tickets_count')
  end

  def have_remaining_tickets? #tickets restant dans le carnet commencé et en cours le plus ancien
    self.tickets_books.sum(:remaining_tickets).positive?
  end

  def last_availible_tickets_book #carnet commencé et en cours le plus ancien
    self.tickets_books.where('remaining_tickets > ?', 0).first
  end

  def next_availible_tickets_book #prochain carnet à commencer après celui en cours
    self.tickets_books.where('remaining_tickets > ?', 0).second
  end

  # after_create :send_welcome_email

  private

  def send_welcome_email
    UserMailer.with(user: self).welcome.deliver_now
  end

end
