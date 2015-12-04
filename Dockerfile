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
RUN cd /app && npm install
RUN npm update -g npm

EXPOSE 3000
#ENV PORT=3000

WORKDIR /app
ADD . /app

#start redis, docker, and then node server
RUN touch /redis.conf
RUN usermod -aG docker root

ENTRYPOINT service docker start && redis-server /redis.conf & npm run start


#commands: 
#docker build -t "genome-designer" .
#docker run --privileged=true -i -p 3000:3000 -t genome-designer
#docker run -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/usr/bin/docker -p 3000:3000 -t genome-designer