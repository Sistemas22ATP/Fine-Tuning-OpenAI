FROM node:lts-alpine

WORKDIR /app

COPY ./package*.json ./

RUN apk add --no-cache python3 make g++ cairo-dev pango-dev giflib-dev \
    && npm install

COPY ./src ./
COPY ./public ./

EXPOSE 3000

ENV OPENAI_API_KEY=

CMD ["npm", "start"]
