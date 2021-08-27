FROM node:14.16.1
COPY / /app
WORKDIR /app
RUN npm install
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/bin/sh", "/usr/bin/start.sh"]



