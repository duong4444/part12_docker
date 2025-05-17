FROM node:20 AS build-stage

ENV VITE_BACKEND_URL=http://localhost:3000

WORKDIR /usr/src/app

COPY . .

RUN npm ci

FROM build-stage AS test-stage

RUN npm run test

CMD ["npm","run","dev","--","--host"]