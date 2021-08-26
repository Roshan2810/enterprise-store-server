FROM node:14.16.1
COPY / /app
WORKDIR /app
RUN npm install
RUN apt-get update && apt-get install -y redis-server
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]

