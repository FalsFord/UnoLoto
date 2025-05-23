from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import LotteryBase, TicketBase, SUserRegister, CardBase
from core.models import User
from pydantic import EmailStr
from sqlalchemy import select, desc
from sqlalchemy.engine import Result
from core.models.lottery_games.lottery_games import Lottery, Ticket, Card


async def get_users(session: AsyncSession) -> list[User]:
    stmt = select(User).order_by(User.username)
    result: Result = await session.execute(stmt)
    users = result.scalars().all()
    return list(users)


async def get_user(
    session: AsyncSession, username: str = None, email: EmailStr = None
) -> User:
    if username is None and email is None:
        raise ValueError("Either username or email must be provided")

    stmt = None
    try:
        if username is not None:
            stmt = select(User).where(User.username == username)
        elif email is not None:
            stmt = select(User).where(User.email == email)

        if stmt is None:
            return None

        result = await session.execute(stmt)
        user = result.scalars().first()
        print(f"Found user: {user}")  # Р”РѕР±Р°РІРёРј Р»РѕРіРёСЂРѕРІР°РЅРёРµ
        return user

    except Exception as e:
        print(f"Error in get_user: {str(e)}")
        return None


async def get_last_lottery(session: AsyncSession) -> int:
    result = await session.execute(
        select(Lottery.id).order_by(desc(Lottery.id)).limit(1)
    )
    last_lottery = result.scalar_one_or_none()
    print("LOOOOTTTERRY")
    return last_lottery


async def get_last_ticket(session: AsyncSession) -> int:
    result = await session.execute(select(Ticket.id).order_by(desc(Ticket.id)).limit(1))
    last_ticket = result.scalar_one_or_none()
    return last_ticket


async def create_user(session: AsyncSession, user_in: SUserRegister) -> User:
    user = User(**user_in.model_dump())
    session.add(user)
    print(f"Attempting to create user: {user_in.model_dump()}")
    await session.commit()
    # await session.refresh(user)
    return user


def lottery_base_to_model(lottery_base: LotteryBase) -> Lottery:
    return Lottery(
        num_tickets=lottery_base.num_tickets,
        prize_fund=lottery_base.prize_fund,
        jackpot=lottery_base.jackpot,
        ticket_price=lottery_base.ticket_price,
    )


async def create_lottery(session: AsyncSession, lottery_in: LotteryBase) -> Lottery:
    lottery = lottery_base_to_model(lottery_in)
    session.add(lottery)
    await session.commit()
    await session.refresh(lottery)
    return lottery


async def create_ticket(session: AsyncSession, ticket_in: TicketBase) -> Ticket:
    ticket = Ticket(**ticket_in.model_dump())  # Use the actual Ticket model
    session.add(ticket)
    await session.commit()
    await session.refresh(ticket)
    return ticket


async def create_card(session: AsyncSession, card_in: CardBase) -> Card:
    card = Card(**card_in.model_dump())  # Use the actual Card model
    session.add(card)
    await session.commit()
    await session.refresh(card)
    return card
