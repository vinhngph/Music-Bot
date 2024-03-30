# Stage 1 - BUILD
FROM node:lts-alpine AS BUILD

WORKDIR /build

RUN apk update && \
    apk add --no-cache build-base python3 libtool autoconf automake && \
    chown node:node /build

USER node 

# Build source code
COPY --chown=node:node ./src/. ./build
RUN npm init -y && \
    npm install --save-dev @babel/core @babel/cli && \
    ./node_modules/.bin/babel build --out-dir src && \
    rm -rf package.json package-lock.json ./node_modules/ ./build/

# Build dependencies
COPY --chown=node:node ./package.json ./
RUN npm install --omit=dev && \
    rm -rf package-lock.json package.json
    
# Copy .env
COPY --chown=node:node ./.env ./
#---------------------------------------------------------------------------------------

# Stage 2 - DEPLOY
FROM node:lts-alpine

WORKDIR /project

RUN apk update && \
    apk add --no-cache ffmpeg && \
    chown node:node /project

USER node

COPY --chown=node:node --from=BUILD ./build/ .

CMD [ "node","./src/index.js" ]
#---------------------------------------------------------------------------------------
