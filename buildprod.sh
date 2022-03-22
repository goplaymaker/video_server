#!/bin/bash

# Build web and other services
cd D:/learn-area/go-wp/video_server/api/
env GOOS=linux go build -o ../bin/api

cd D:/learn-area/go-wp/video_server/scheduler/
env GOOS=linux go build -o ../bin/scheduler

cd D:/learn-area/go-wp/video_server/streamserver/
env GOOS=linux go build -o ../bin/streamserver

cd D:/learn-area/go-wp/video_server/web/
env GOOS=linux go build -o ../bin/web