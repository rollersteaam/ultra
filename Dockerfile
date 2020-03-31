FROM node:12.2.0-alpine

LABEL MAINTAINER "Jordan Peters"

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install --silent

COPY . /app

CMD ["npm", "start"]
