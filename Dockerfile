FROM node:16.15-alpine

WORKDIR /app
ENV NODE_ENV=production

ENV PATH /app/node_modules/.bin:$PATH
RUN apk add  --no-cache ffmpeg
RUN apk update

COPY package.json /app/

RUN npm install

COPY . /app/

RUN npx prisma migrate deploy

RUN npx tsc

CMD ["npm", "start"]
