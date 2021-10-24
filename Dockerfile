FROM node:14

WORKDIR /usr/src/app

COPY package*.json app.js ./

RUN npm install

COPY . .

EXPOSE 5000
CMD [ "node", "app.js" ]