#!/bin/bash
redis-server --bind 0.0.0.0 --daemonize yes
redis-cli config set notify-keyspace-events Ex
npm start