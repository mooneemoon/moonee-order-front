FROM node:16-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
RUN yarn global add turbo

ARG APP_PROFILE=dev
ENV APP_PROFILE=${APP_PROFILE} \
    SCOPE=payment-demo
WORKDIR /app

FROM base AS pruner

COPY . .
RUN turbo prune --scope=${SCOPE} --docker

FROM base AS deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
RUN yarn install --frozen-lockfile

FROM base AS builder

ENV NODE_ENV=production

COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json .

RUN cp /app/apps/demo/.env.${APP_PROFILE} /app/apps/demo/.env
RUN turbo run build --filter=${SCOPE}

FROM nginx:stable-alpine as app
WORKDIR /app
COPY --from=builder /app/apps/demo/build /usr/share/nginx/html
COPY --from=builder /app/apps/demo/nginx/nginx.template /etc/nginx/conf.d/default.template

ENV NGINX_PORT="80"

CMD /bin/sh -c "envsubst '\${NGINX_PORT}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
