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

ADD . /app

#install extensions
RUN cd /app && git submodule init
RUN cd /app && git submodule update

#setup node
ADD package.json /app/package.json
RUN npm update -g npm
RUN cd /app && npm install

EXPOSE 3000
ENV PORT=3000

WORKDIR /app

#start redis, docker, and then node server
RUN touch /redis.conf
RUN usermod -aG docker root

ENTRYPOINT service docker start && redis-server /redis.conf & npm run start

#everything needed by extensions
RUN apt-get install -y python3 python3-pip
RUN yes | pip3 install biopython
