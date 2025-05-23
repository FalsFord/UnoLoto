import os
import sys
from logging.config import fileConfig

from sqlalchemy.ext.asyncio import create_async_engine  # Для асинхронного режима
from alembic import context

# Добавьте путь к проекту
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Импортируйте ваши модели и настройки
from core.models import Base
from core.config import settings

# Укажите целевую метаданную
target_metadata = Base.metadata

# Обновите функцию подключения для асинхронного режима
async def run_migrations_online():
    connectable = create_async_engine(settings.db_url)

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

async def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()