FROM node:lts-alpine

WORKDIR /vinyl

RUN apk update && \
    apk add --no-cache build-base python3 libtool ffmpeg autoconf automake && \
    chown node:node /vinyl

USER node

COPY --chown=node:node package.json ./

RUN yarn install --production

COPY --chown=node:node . .

CMD [ "yarn","start" ]