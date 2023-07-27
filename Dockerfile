FROM node:16.15-alpine

WORKDIR /app
#ENV NODE_ENV=production

ENV PATH /app/node_modules/.bin:$PATH
RUN apk add --no-cache ffmpeg
RUN apk update

COPY package.json /app/

RUN npm install

COPY . /app/

COPY entrypoint.sh /app

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]

