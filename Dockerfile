FROM node:16.17-slim

RUN npm install -g serve

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["serve", "-s", "dist"]
