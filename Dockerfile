# Inherit from node v4 docker image
FROM node:4-wheezy

RUN apt-get update
RUN apt-get install -y curl wget

#Install Redis
RUN wget http://download.redis.io/redis-stable.tar.gz
RUN tar xvzf redis-stable.tar.gz
RUN cd redis-stable; make; make install

#Install Docker
RUN echo "deb http://ftp.de.debian.org/debian wheezy-backports main" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y --force-yes apt-transport-https
RUN echo "deb https://apt.dockerproject.org/repo debian-wheezy main" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y --force-yes docker-engine

#setup node
ADD package.json /app/package.json
RUN npm update -g npm
RUN cd /app && npm install

#install extensions
RUN git submodule init
RUN git submodule update

EXPOSE 3000
ENV PORT=3000

WORKDIR /app
ADD . /app

#start redis, docker, and then node server
RUN touch /redis.conf
RUN usermod -aG docker root

ENTRYPOINT service docker start && redis-server /redis.conf & npm run start

