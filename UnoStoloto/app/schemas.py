from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Literal, Tuple, Dict

ticket_color = Literal["red", "blue", "green", "yellow"]


class EmailModel(BaseModel):
    email: EmailStr = Field(description="Электронная почта")
    model_config = ConfigDict(from_attributes=True)


class UserBase(EmailModel):
    username: str = Field(description="Имя пользователя")
    city: str = Field(description="Город проживания")
    vip_status: int = Field(
        description="уровень вип-статуса - 0 - обычный пользователь, 1,2,3 - уровни вип_статуса"
    )
    balance: int = Field(description="Баланс бонусной валюты")


class SUserRegister(UserBase):
    password: str = Field(description="пароль")


class SUserAuth(EmailModel):
    password: str = Field(description="пароль")


class LotteryBase(BaseModel):
    num_tickets: int = Field(description="Количество купленных билетов")
    prize_fund: int = Field(description="Сумма призового фонда (в рублях)")
    jackpot: int = Field(description="Сумма джекпота/суперприза")
    ticket_price: int = Field(description="Стоимость одного билета")


class Card(BaseModel):
    number: int = Field(description="Номер карты")
    color: ticket_color = Field(description="Цвет карты")


class CardBase(BaseModel):
    number: int = Field(description="Номер карты")
    color: ticket_color = Field(description="Цвет карты")
    ticket_id: int
    accurate: str | None = Field(description="Точность совпадения")


class TicketSet(BaseModel):
    ticketSets: List[List[Card]]
    timestamp: str
    totalSets: int
    user_email: EmailStr


class TicketBase(BaseModel):
    lottery_id: int = Field(description="Айди лотереи")
    user_id: int = Field(description="ID пользователя, который купил билет")


class DrawResult(BaseModel):
    drawn: Card
    match_type: Literal["full", "partial", "none"]


class TicketResult(BaseModel):
    input: List[Card]
    results: List[DrawResult]
    full_count: int
    partial_count: int
    category: Literal["3F", "2P1N", "1F1P1N", "1F2P", "2F1P", "No Win"]


class UnoResponseModel(BaseModel):
    timestamp: str = Field(description="Время отправки")
    totalSets: int = Field(description="Количесвто билетов")
    tickets: List[TicketResult] = Field(description="Результат на совпадение")
