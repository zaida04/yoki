FROM node:12-alpine

RUN mkdir -p /user/src/yoki
WORKDIR /usr/src/yoki
COPY . .
RUN curl -L https://unpkg.com/@pnpm/self-installer | node
ENV TOKEN= \
    DEFAULTPREFIX= \
    NODE_ENV= 
RUN pnpm i --r --prod
RUN pnpm run build
RUN pnpm run knex:init
CMD [ "node", "./packages/bot/dist/index.js"]