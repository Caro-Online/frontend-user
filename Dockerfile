FROM node:12-alpine

COPY package.json .
COPY package-lock.json .

RUN yarn install; \
  yarn global add serve

COPY . .
COPY default.env ./.env
RUN yarn build

ENV NODE_ENV=production

EXPOSE 3000
CMD serve -p $PORT -s build