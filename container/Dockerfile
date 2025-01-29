FROM node:18-alpine

RUN apk update && apk upgrade && apk add --no-cache ffmpeg

WORKDIR /app


COPY package.json pnpm-lock.yaml ./


RUN npm install -g pnpm && pnpm install && pnpm add typescript


COPY . .

RUN chmod 600 /app/src/ca.pem

CMD ["pnpm", "run", "dev"]
