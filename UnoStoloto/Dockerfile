FROM python:3.13-slim

WORKDIR /app


RUN pip install poetry


COPY pyproject.toml poetry.lock* ./

RUN poetry config virtualenvs.create true && \
    poetry install --no-root --no-interaction --no-ansi


COPY . .

CMD ["python", "main.py"]