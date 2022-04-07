## 流媒体视频网站
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/goplaymaker/video_server)

## Background

该项目是 Go 入坑项目，本人为 Java 开发，有意转 Go，在学习了一些基础知识后，打算做个项目练练手。相较于普通的后台管理系统，我更倾向于社区性质的网站。

无意中在 GitHub 上看到了这个项目的雏形，就打算来做一个流媒体视频网站。该网站的最初方案是，仅支持个人的视频上传与下载播放。我打算在之后慢慢完善这个项目，做成一个可供多人分享的视频网站。

![img](https://cdn.nlark.com/yuque/0/2022/png/2788589/1648518259225-a63beaaf-7c67-4080-88a4-f74d69407043.png)



## Install

下载源码

```git
git clone https://github.com/goplaymaker/video_server.git
```



下载依赖

```go
# 使用 go get 命令进行依赖下载
go get xxx
```



修改 sh 文件脚本文件启动，或者本地 Goland 启动。



## Usage

项目整体框架结构

- api：基础的后端处理 API，包括但不限于用户认证、评论等功能
- bin：经 build.sh 编译后得到的可执行文件
- scheduler：调度服务，用于延时删除视频文件
- streamserver：视频流服务，用于视频的上传与下传
- templates：静态 HTML 及 JS 文件
- videos：本地保存上传的视频文件（仅视频，无代码）
- web：前端服务，用于渲染静态 HTML 文件及分发 JS 处理请求至其他服务

此外还有：build(prod).sh，deploy.sh 是编译和启动脚本文件，initdb.sql 是数据库脚本文件。



项目启动步骤：

1. 下载项目依赖（go get）
2. 初始化数据库（initdb.sql）
3. 编译启动项目（build.sh、deploy.sh）
4. 访问 localhost:8080



## Architecture

项目整体架构

![img](https://cdn.nlark.com/yuque/0/2022/png/2788589/1648520311918-bb8e0684-c6fe-47ed-9ae8-f5123c6c5860.png)

Scheduler 功能架构

![Task runner.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1647495890007-e5f5e1aa-4e11-4ec7-bec2-4cedba04552c.png)



## Maintainers

[@goplaymaker](https://github.com/goplaymaker)



## Change Log

- 2022年4月7日16:39:19：登录页 UI 改造
- 2022年3月29日 10:11:53：增加 README 文档
- 2022年3月22日 10:20:53：增加网站基础功能（用户认证，视频上传播放、评论等）

