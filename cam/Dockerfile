# Inherit from node v4 docker image
FROM node:4-wheezy

#Install Docker
RUN echo "deb http://ftp.de.debian.org/debian wheezy-backports main" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y --force-yes apt-transport-https
RUN echo "deb https://apt.dockerproject.org/repo debian-wheezy main" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y --force-yes docker-engine

#setup node
ADD package.json /app/package.json
RUN cd /app && npm install
RUN npm update -g npm

EXPOSE 3000
WORKDIR /app
ADD . /app

#start redis, docker, and then node server
ENTRYPOINT npm run start

#commands: 
#docker build -t "genome-designer-cam" .
#docker run --privileged=true -i -p 3001:3000 -t genome-designer-cam /bin/bash