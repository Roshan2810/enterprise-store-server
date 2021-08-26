FROM node:14.16.1
FROM redis:3.0.3
CMD redis-server --bind 0.0.0.0
COPY / /app
WORKDIR /app
RUN npm install
RUN apt-get update && apt-get install -y redis-server
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]

