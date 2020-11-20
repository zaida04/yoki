FROM node:14
ENV TOKEN= \
    DEFAULTPREFIX= \
    NODE_ENV= 
RUN mkdir -p /user/src/yoki
WORKDIR /usr/src/yoki

COPY pnpm-workspace.yml ./pnpm-workspace.yml
COPY tsconfig.json ./tsconfig.json
COPY package.json ./package.json
COPY ./libs/logger/package.json ./libs/logger/package.json
COPY ./packages/bot/package.json ./packages/bot/package.json

RUN curl -L https://unpkg.com/@pnpm/self-installer | node
RUN pnpm i --recursive --prod
COPY . .

RUN pnpm run build && pnpm prune --prod
RUN pnpm run knex:init
CMD [ "node", "packages/bot/dist/index.js"]