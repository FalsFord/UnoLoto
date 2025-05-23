from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from core.models.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    city: Mapped[str] = mapped_column(nullable=False)
    vip_status: Mapped[int] = mapped_column(nullable=False)
    balance: Mapped[int] = mapped_column(nullable=False)
    tickets = relationship("Ticket", back_populates="user")


class Lottery(Base):
    __tablename__ = "lotteries"

    num_tickets: Mapped[int] = mapped_column(nullable=False)
    prize_fund: Mapped[int] = mapped_column(nullable=False)
    jackpot: Mapped[int] = mapped_column(nullable=False)
    ticket_price: Mapped[int] = mapped_column(nullable=False)
    tickets = relationship(
        "Ticket", back_populates="lottery")


class Ticket(Base):
    __tablename__ = "tickets"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="tickets")
    lottery_id: Mapped[int] = mapped_column(ForeignKey("lotteries.id"), nullable=False)
    lottery = relationship("Lottery", back_populates="tickets")
    card = relationship("Card", back_populates="ticket")


class Card(Base):
    __tablename__ = "cards"

    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id"), nullable=False)
    ticket = relationship("Ticket", back_populates="card")
    number: Mapped[int] = mapped_column(nullable=False)
    color: Mapped[str] = mapped_column(nullable=False)
    accurate: Mapped[str] = mapped_column(nullable=False)
