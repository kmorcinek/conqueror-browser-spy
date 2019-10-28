FROM node:6.11.5
RUN apt-get update \
    && apt-get install -y \
        vim
RUN npm install browserify -g
RUN npm install tsify -g
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .

CMD [ "npm", "start" ]

