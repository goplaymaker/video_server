#!/bin/bash

# Build web and other services
cd /code/video_server/api/
env GOOS=linux go build -o ../bin/api

cd /code/video_server/scheduler/
env GOOS=linux go build -o ../bin/scheduler

cd /code/video_server/streamserver/
env GOOS=linux go build -o ../bin/streamserver

cd /code/video_server/web/
env GOOS=linux go build -o ../bin/web