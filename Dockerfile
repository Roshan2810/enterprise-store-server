RUN sudo apt-get purge --auto-remove nodejs
FROM node:14.16.1
RUN wget http://download.redis.io/redis-stable.tar.gz && \
    tar xvzf redis-stable.tar.gz && \
    cd redis-stable && \
    make && \
    mv src/redis-server /usr/bin/ && \
    cd .. && \
    rm -r redis-stable && \
    npm install -g concurrently   

EXPOSE 6379

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3001

EXPOSE 3006

EXPOSE 6379

CMD concurrently "/usr/bin/redis-server --bind '0.0.0.0'" "sleep 5s; node /app/server.js" "sleep 1s; node /app/subscriber.js"  



