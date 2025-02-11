FROM node:20.18-alpine3.19

RUN mkdir -p /usr/local/service/tourii-onchain && \
    chown -R node:node /usr/local/service/tourii-onchain

USER root

RUN apk update && \
    apk add --no-cache --update procps bash && \
    rm -rf /var/lib/apt/lists/*

# NOTE: https://github.com/nodejs/corepack/issues/612 に伴い、CIがこけるのでcorepackのバージョンを2025/02/03時点最新を指定
RUN npm install -g corepack@0.31.0 && \
    corepack enable && \
    corepack prepare pnpm@9.15.5 --activate

USER node

WORKDIR /usr/local/service/tourii-onchain

CMD if [ ! -d "node_modules" ]; then pnpm install --frozen-lockfile; fi \
    && pnpm run start:dev:tourii-onchain
