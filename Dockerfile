FROM node:16.17-slim

RUN npm install -g serve

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./dist ./dist

CMD ["npm", "run", "serve"]
