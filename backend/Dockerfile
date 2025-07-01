FROM node:20-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:20-alpine as production
WORKDIR /app
# С помощью параметера --from указываем, что копировать нужно из образа builder
# Копируем package.json и package-lock.json (потребуются для установки зависимостей)
COPY --from=builder /app/package*.json ./
# Устанавливаем только зависимости, необходимые в продакшене
# --omit=dev означает «пропустить dev-зависимости»
RUN yarn --prod
# Копируем директорию со сборкой приложения
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/public ./public/

# Указываем команду для запуска приложения
CMD ["node", "./dist/main.js"] 