FROM strapi/base:14

WORKDIR /opt/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --prod

RUN npx browserslist@latest --update-db

COPY . .
ADD public ./

ENV NODE_ENV production
ENV DATABASE_CLIENT=postgres
ENV ADMIN_JWT_SECRET=6915144765284459439d73aa7683f811

# Instalação do dockerize
RUN apk add --no-cache wget
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz
RUN tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-v0.6.1.tar.gz
RUN rm dockerize-alpine-linux-amd64-v0.6.1.tar.gz

RUN yarn build

EXPOSE 1337
CMD ["yarn", "start"]
