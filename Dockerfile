# Inherit from node v4 docker image
FROM node:4-wheezy

RUN apt-get update
RUN apt-get install curl -y

ADD package.json /app/package.json
RUN cd /app && npm install
RUN npm update -g npm

EXPOSE 3000
ENV PORT=3000

WORKDIR /app
ADD . /app

#CMD ["node", "devServer.js"]
CMD ["npm", "run", "start"]