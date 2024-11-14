# FROM node:16.13.2-alpine
FROM node:16.17.0-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json .

RUN apk add --no-cache make gcc g++ python3

RUN npm cache clean --force

RUN npm i -g node-gyp

RUN npm install node-pre-gyp -g

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]