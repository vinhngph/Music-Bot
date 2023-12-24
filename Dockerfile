FROM node:lts-alpine AS BUILD

WORKDIR /build

RUN apk update && \
    apk add --no-cache build-base python3 libtool autoconf automake && \
    chown node:node /build

USER node 

COPY --chown=node:node package.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run deploy && \
    rm -rf node_modules package-lock.json && \
    npm install --omit=dev && \
    rm -rf package-lock.json package.json .dockerignore


FROM node:lts-alpine

WORKDIR /vinz

RUN apk update && \
    apk add --no-cache ffmpeg && \
    chown node:node /vinz

USER node

COPY --chown=node:node --from=BUILD /build/ /vinz/

CMD [ "node","./src/index.js" ]