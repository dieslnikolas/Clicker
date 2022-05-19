FROM node:14

# Move node-modules
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json

# Clean build folder and instal modules
RUN rm -rf ../../dist/api
RUN cd /tmp && npm ci

ADD ./ /src
RUN rm -rf src/node_modules && cp -a /tmp/node_modules /src/

WORKDIR /src
RUN yarn build

CMD ["node", "build/src/app.js"]