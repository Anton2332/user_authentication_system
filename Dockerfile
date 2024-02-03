# build backend
FROM node:21 AS build

WORKDIR /app

COPY package.json  ./

RUN yarn install --frozen-lockfile

COPY nest-cli.json ./
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY check-env.js ./check-env.js

RUN yarn generate
RUN yarn run build

# run backend
FROM node:21 AS run

WORKDIR /app

COPY package.json ./
COPY src ./src
COPY check-env.js ./check-env.js

RUN yarn install --frozen-lockfile --production=true
RUN yarn generate

COPY --from=build /app/dist ./dist

CMD ["node", "--enable-source-maps", "dist/main.js"]