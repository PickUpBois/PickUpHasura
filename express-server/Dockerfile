FROM node:12.13-alpine as development

WORKDIR /app

COPY package.json ./

RUN apk update && apk add bash

RUN npm install

COPY . .

CMD ["npm", "run", "start"]

