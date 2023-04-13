FROM node:16-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache ffmpeg yt-dlp
RUN apk update

WORKDIR /app

RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=server --docker

FROM node:16-alpine AS installer

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install
RUN yarn global add turbo

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN turbo run build --filter=server

FROM node:16-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app

USER app
COPY --from=installer /app .

EXPOSE 4000
ENV NODE_ENV=production
ENV PORT=4000
ENV DATABASE_URL="${DATABASE_URL}"
ENV OPENAI_API_KEY="${OPENAI_API_KEY}"

CMD node apps/server/dist/index.js
