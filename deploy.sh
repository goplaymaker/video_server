#! /bin/bash

cp -R ./templates ./bin/

mkdir ./bin/videos

cd bin

# 后台进程启动服务(非阻塞式)
nohup ./api &
nohup ./scheduler &
nohup ./streamserver &
nohup ./web &