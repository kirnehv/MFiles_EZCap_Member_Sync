FROM node:12-alpine as mfiles_ezcap_member_sync
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
CMD [ "node", "./bin/server.js" ]

FROM node:12-alpine as mfiles_ezcap_member_sync_telehealth
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
CMD [ "node", "./bin/server-telehealth.js" ]
