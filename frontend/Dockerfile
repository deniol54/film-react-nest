FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
RUN npm i @rollup/rollup-linux-x64-musl --save-dev
COPY . .
CMD ["npm", "run", "build"]