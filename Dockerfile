FROM node:14.16.1
COPY / /app
WORKDIR /app
RUN npm install
RUN apt-get update && apt-get install -y redis-server
EXPOSE 6379
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
COPY config.sh /usr/bin/config.sh
RUN chmod +x /usr/bin/config.sh
CMD ["/bin/sh", "/usr/bin/start.sh"]



