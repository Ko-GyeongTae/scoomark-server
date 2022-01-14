FROM node:16 AS builder
WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

FROM node:16-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 5010

CMD ["yarn", "start"]