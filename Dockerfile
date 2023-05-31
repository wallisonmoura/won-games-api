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


RUN yarn build

EXPOSE 1337
CMD ["yarn", "start"]
