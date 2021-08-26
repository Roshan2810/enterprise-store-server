#!/bin/bash
commit_id=$(git rev-parse --short HEAD)
echo $commit_id> commit_id.txt
docker build -t roshan2810/enterprise-store-server:$commit_id .
docker login --username=roshan2810 --password=Welcome@123
docker push roshan2810/enterprise-store-server:$commit_id