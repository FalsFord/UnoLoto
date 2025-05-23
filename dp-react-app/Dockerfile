# Этап 1: Сборка React-приложения
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --unsafe-perm
RUN npm ci --silent

COPY / ./
RUN npm run build

# Этап 2: Запуск в продакшене (с использованием serve)
FROM node:20-alpine

# Устанавливаем serve для раздачи статики
RUN npm install -g serve

WORKDIR /app


# Порт, который слушает serve (по умолчанию 3000)
EXPOSE 3000

# Запускаем сервер (можно добавить --cors, если нужны CORS-заголовки)
CMD ["npm", "start"]