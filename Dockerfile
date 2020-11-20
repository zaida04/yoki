FROM node:14-alpine
LABEL name "Yoki BOT"
LABEL version "0.0.1"
ENV TOKEN= \
    DEFAULTPREFIX= \
    NODE_ENV= 

WORKDIR /usr/yoki

RUN apk add --update \
    && apk add --no-cache ca-certificates \
    && apk add --no-cache --virtual .build-deps curl

RUN curl -L https://unpkg.com/@pnpm/self-installer | node && apk del .build-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY libs/logger/package.json ./libs/logger/
COPY packages/bot/package.json ./packages/bot/

RUN pnpm i --recursive --frozen-lockfile --filter sqlite3

COPY libs/logger ./libs/logger
COPY packages/bot ./packages/bot

RUN pnpm run build && pnpm prune --prod && pnpm run knex:init

CMD [ "node", "packages/bot/dist/index.js"]