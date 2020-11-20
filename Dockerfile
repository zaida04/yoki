FROM node:14
ENV TOKEN= \
    DEFAULTPREFIX= \
    NODE_ENV= 
WORKDIR /usr/src/yoki

RUN curl -L https://unpkg.com/@pnpm/self-installer | node
COPY pnpm-workspace.yml tsconfig.json package.json ./libs/logger/package.json ./packages/bot/package.json ./
RUN pnpm i --recursive --frozen-lockfile --filter sqlite3
COPY . .

RUN pnpm run build && pnpm prune --prod
RUN pnpm run knex:init
CMD [ "node", "packages/bot/dist/index.js"]