from contextlib import asynccontextmanager

from core.models import Base, db_helper
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles


import uvicorn
from pathlib import Path

from app.router import router
from core import router as user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with db_helper.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("РўР°Р±Р»РёС†С‹ СЃРѕР·РґР°РЅС‹")
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router)
app.include_router(user_router)


BASE_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

origins = [
    "http://81.94.158.193:5000",  # Your React frontend
    "http://localhost:5000", 
    "http://81.94.158.193:3000",  # Your React frontend
    "http://localhost:3000", # For local development
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods= ["*"],  # Explicitly list methods,
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    return response


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        reload=True,
        host="0.0.0.0",
        port=8000,
       
        
    )
