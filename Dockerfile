FROM node:14-alpine
LABEL name "Yoki BOT"
LABEL version "0.0.1"
ENV TOKEN= \
    DEFAULTPREFIX=

WORKDIR /usr/yoki

RUN apk add --update \
    && apk add --no-cache ca-certificates \
    && apk add --no-cache --virtual .build-deps curl

RUN curl -L https://unpkg.com/@pnpm/self-installer | node && apk del .build-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yml tsconfig.json ./
COPY libs/logger/package.json ./libs/logger/
COPY packages/bot/package.json ./packages/bot/

RUN pnpm i --recursive

COPY libs/logger ./libs/logger
COPY packages/bot ./packages/bot
RUN pnpm run build && pnpm prune --prod

ENV NODE_ENV=
COPY . .
RUN pnpm run knex:init
CMD [ "node", "packages/bot/dist/index.js"]
