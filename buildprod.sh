#!/bin/bash

# 由于我 Linux 环境没有装 Go 环境, 所以我是在 Windows 环境下执行该 shell
# Build web and other services
cd D:/learn-area/go-wp/video_server/api/
env GOOS=linux go build -o ../bin/api

cd D:/learn-area/go-wp/video_server/scheduler/
env GOOS=linux go build -o ../bin/scheduler

cd D:/learn-area/go-wp/video_server/streamserver/
env GOOS=linux go build -o ../bin/streamserver

cd D:/learn-area/go-wp/video_server/web/
env GOOS=linux go build -o ../bin/web