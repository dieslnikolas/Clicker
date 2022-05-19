# 1) Image dependencies
FROM node:14

# 2) Prepare NodeJS Dependencies
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN rm -rf ../../dist/api/
RUN cd /tmp && npm ci

# 3) Build application
ADD ./ /src 
RUN rm -rf src/node_modules && cp -a /tmp/node_modules /src/

# 4) Run Application
WORKDIR /src
RUN ts-node-dev --respawn --transpile-only src/app.ts