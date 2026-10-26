FROM node:24 AS development

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .
