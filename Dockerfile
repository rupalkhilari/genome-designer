# Inherit from node v4 docker image
FROM node:4-wheezy

RUN apt-get update
RUN apt-get install -y curl wget

#Install Redis
RUN wget http://download.redis.io/redis-stable.tar.gz
RUN tar xvzf redis-stable.tar.gz
RUN cd redis-stable; make; make install

ADD package.json /app/package.json
RUN cd /app && npm install

EXPOSE 3000
ENV PORT=3000

WORKDIR /app
ADD . /app

#CMD ["node", "devServer.js"]
CMD ["npm", "run", "start"]