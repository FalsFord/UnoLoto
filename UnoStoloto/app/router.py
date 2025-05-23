import random

from fastapi import APIRouter, HTTPException, status, Response
import httpx
from app.schemas import (
    SUserRegister,
    UserBase,
    SUserAuth,
    UnoResponseModel,
    ticket_color,
    TicketSet,
    TicketResult,
    DrawResult,
    Card,
    TicketBase,
    CardBase,
    LotteryBase,
)
from core.models.lottery_games import crud
from pathlib import Path
from typing import List
from pydantic import EmailStr, BaseModel
from starlette.responses import FileResponse, RedirectResponse

from core.models import db_helper
from fastapi import Request, Depends

from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.lottery_games.crud import get_last_lottery

BASE_DIR = Path(__file__).resolve().parent.parent

router = APIRouter()
router.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


# Random.org API endpoint
RANDOM_ORG_API = "https://www.random.org/integers/?num={n}&min=0&max=255&col=1&base=10&format=plain&rnd=new"


async def fetch_random_org(n: int) -> List[int]:

    print(RANDOM_ORG_API)
    url = RANDOM_ORG_API.format(n=n)

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            raise HTTPException(status_code=503, detail="Random.org API unavailable")
        lines = resp.text.strip().splitlines()
        ints = [int(line) for line in lines if line.isdigit()]
        if len(ints) < n:
            raise HTTPException(status_code=503, detail="Insufficient random.org data")
        return ints[:n]


DECK = []
for color in ticket_color.__args__:
    DECK.append({"number": 0, "color": color})
    for num in range(1, 10):
        DECK.extend([{"number": num, "color": color}] * 2)
DECK_SIZE = len(DECK)


@router.post("/register", response_model=UserBase)
async def register_user(
    user_data: SUserRegister,
    session: AsyncSession = Depends(db_helper.scoped_session_dependency),
):
    return await crud.create_user(session=session, user_in=user_data)


@router.get("/register")
def get_register_page():
    return FileResponse(BASE_DIR / "static" / "register" / "index.html")


@router.get("/profile")
async def get_profile(
    request: Request,
    session: AsyncSession = Depends(db_helper.scoped_session_dependency),
):
    email_str = request.cookies.get("email")
    if not email_str:
        return RedirectResponse(url="/login", status_code=300)

    try:

        class EmailModel(BaseModel):
            email: EmailStr

        email_model = EmailModel(email=email_str)
        user = await crud.get_user(session=session, email=email_model.email)

    except ValueError as e:
        return RedirectResponse(url="/login", status_code=300)

    profile = Jinja2Templates(directory="static/profile")
    return profile.TemplateResponse("profile.html", {"request": request, "user": user})


@router.get("/login")
def get_login_page():
    return FileResponse(BASE_DIR / "static" / "login" / "login.html")


@router.post("/login")
async def login_user(
    response: Response,
    user_data: SUserAuth,
    session: AsyncSession = Depends(db_helper.scoped_session_dependency),
):
    email = user_data.email
    password = user_data.password
    user = await crud.get_user(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User not found!",
        )
    elif password == user.password:
        response.set_cookie(key="email", value=email)
        return user


@router.get("/logout")
async def logout(response: Response):
    response.delete_cookie("email")
    return RedirectResponse(url="/login", status_code=303)


@router.get("/user/{username}", response_model=UserBase)
async def get_user(
    username: str, session: AsyncSession = Depends(db_helper.scoped_session_dependency)
):

    user = await crud.get_user(session=session, username=username)
    if user is not None:
        return user
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"User {username} not found!",
    )


@router.get("/lottery")
async def get_lottery(
    request: Request,
    session: AsyncSession = Depends(db_helper.scoped_session_dependency),
):
    lottery_id = await crud.get_last_lottery(session)
    lottery = Jinja2Templates(directory="static/lottery")
    return lottery.TemplateResponse("lottery.html", {"request": request, "lottery_id": lottery_id})


@router.post("/lottery", response_model=LotteryBase)
async def create_lottery(
    lottery_data: LotteryBase,
    session: AsyncSession = Depends(db_helper.scoped_session_dependency),
):
    return await crud.create_lottery(session, lottery_data)


@router.get("/potionloto")
async def get_potionloto():
    return FileResponse(BASE_DIR / "static" / "login" / "login.html")

@router.get("/unogame")
async def get_unogame():
    return FileResponse(BASE_DIR / "static" / "login" / "login.html")


@router.post("/unogame", response_model=UnoResponseModel)
async def draw_tickets(
    ticket_data: TicketSet,
    session: AsyncSession = Depends(db_helper.scoped_session_dependency),
):
    if ticket_data.totalSets != len(ticket_data.ticketSets):
        raise HTTPException(status_code=400, detail="totalSets mismatch")

    user = await crud.get_user(session=session, email=ticket_data.user_email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email {ticket_data.user_email} not found!",
        )

    results = []
    user_id = user.id

    for ticket in ticket_data.ticketSets:
        lottery_id = await crud.get_last_lottery(session)
        print(lottery_id)
        this_ticket = TicketBase(lottery_id=lottery_id, user_id=user_id)
        print(this_ticket)
        await crud.create_ticket(session, this_ticket)

        try:
            rand_bytes = await fetch_random_org(3)
            source = "random.org"
        except HTTPException:
            rand_bytes = [random.getrandbits(8) for _ in range(3)]
            source = "python"

        print(f"[RNG] Used {source} generator for 3 draws")
        # await asyncio.sleep(0.2)

        draws = [DECK[b % DECK_SIZE] for b in rand_bytes]

        full = partial = none = 0
        draw_results = []
        for inp, drawn in zip(ticket, draws):
            try:
                card = Card(**drawn)
                if inp.number == card.number and inp.color == card.color:
                    mt = "full"
                    full += 1
                elif inp.number == card.number or inp.color == card.color:
                    mt = "partial"
                    partial += 1
                else:
                    mt = "none"
                    none += 1
                draw_results.append(DrawResult(drawn=card, match_type=mt))
            except ValueError as e:
                print(f"Ошибка создания карты: {e}, данные: {drawn}")
                continue

        for card, result in zip(ticket, draw_results):
            ticket_id = await crud.get_last_ticket(session)
            this_card = CardBase(
                number=card.number,
                color=card.color,
                ticket_id=ticket_id,
                accurate=result.match_type,
            )
            await crud.create_card(session, this_card)

        if full == 3:
            cat = "3F"
        elif full == 2 and partial == 1:
            cat = "2F1P"
        elif full == 1 and partial == 2:
            cat = "1F2P"
        elif full == 1 and partial == 1 and none == 1:
            cat = "1F1P1N"  # 1F+1P+1N — Полумассовый приз
        elif full == 0 and partial == 2 and none == 1:
            cat = "2P1N"  # 2P+1N — Массовый приз
        else:
            cat = "No Win"  # нет призовой комбинации
        print("ERRORROOROROROROROR")
        print(partial, cat)
        results.append(
            TicketResult(
                input=ticket,
                results=draw_results,
                full_count=full,
                partial_count=partial,
                none_count=none,
                category=cat,
            )
        )

    return UnoResponseModel(
        timestamp=ticket_data.timestamp,
        totalSets=ticket_data.totalSets,
        tickets=results,
    )
