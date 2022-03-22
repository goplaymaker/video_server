<a name="wIatf"></a>
## 相关资源连接
Go 代码（来源网上）：<br />[alanhou / golang-streaming](https://github.com/alanhou/golang-streaming)

<a name="wAkSD"></a>

## Linux 命令
我在 windows 中利用 Git Bash 命令行来使用 Linux 命令
```go
ps -ef 查看当前运行进程信息

ps aux | grep xxx 查看 xxx 进程信息

kill -9 pid 杀死进程

nohup ... 用于后台运行命令（比如我们后台启动一个服务，如果不使用这个命令，那么整个 shell 脚本就会被阻塞）
```

<a name="HJbvt"></a>
## Go 工具/命令
```go
go command [arguments]

go build 编译
go run 编译+运行
go install 打包
go get [-u] 下载依赖
go fmt 格式化
go test 执行测试文件
    两种模式：
    1. test 普通的测试方法
    2. benchmark 压测，跑多轮，达到稳态停止
```
<a name="xHG4r"></a>

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1646893085953-48d877de-d5d1-4105-b4e6-18e7c7d1098c.png?x-oss-process=image%2Fresize%2Cw_663%2Climit_0)



### go install 与 go build
相同点：

1. 都是用来编译包及其依赖的包，生成一个 .exe 文件

不同点：

1. go install 一般生成静态库文件放在 &GOPATH/pkg 目录下，对于 main 包，则会生成一个 .exe 文件放在 &GOPATH/bin 下。
1. **go build 不详（TODO），生成 .exe 文件放在当前文件下。**



<a name="MDuAu"></a>
## 流媒体点播网站
Go 是一门网络编程语言<br />包含大部分技能点<br />优良的 native http 库和模板库

前后端解耦

REST API

API 设计<br />

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1646903281414-3b82d336-fa89-4a25-98a2-83a38e6bf632.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)

HttpRouter<br />http 库

<a name="ez9TT"></a>
### API 模块
<a name="X4Ttj"></a>
#### 用户
创建用户：/user POST SC: 201,400,500

用户登录：/user/:username POST SC: 200,400,500

获取用户信息：/user/:username GET 200,400,401,403,500

用户注销：/user/:username DELETE SC: 204,400,401,403,500

<a name="HkYqn"></a>
#### 用户资源
List All Videos：/user/:username/videos GET SC:200,400,500

Get one video：/user/:username/videos/:vid-id GET SC: 200,400, 500

Delete one video：/user/:username/videos DELETE SC:204,400,401,403,500

<a name="vT6tX"></a>
#### 评论
Show comments：/videos/:vid-id/comments GET 200,400,500

Post a commnet：/videos/:vid-id/comments POST 201,400,500

Delete a comment：/videos/:vid-id/comments/:comment-id POST 204,400,401,403,500


handler -> validation -> business logic -> response

<a name="ZGv8b"></a>
#### 数据库设计
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1646914800317-54c8f8ac-ca25-44c5-8bca-38ddf9d12e88.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1646914817720-cc44b59b-7285-4fa2-b686-82961b0f0103.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1646914898969-1a68f532-097f-4967-99d3-5ad43f08bcc0.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1646914985889-17e69310-0cd2-43ab-b46b-5a7097cd1a40.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)




<a name="nPPrr"></a>
### Stream
<a name="VRZ1m"></a>
#### stream
ConnLimiter 限流器（goroutine+channel 实现， 测试限制最多两个连接）<br />返回视频流

<a name="jtnnz"></a>
#### upload
上传视频文件


<a name="j32yG"></a>
### Scheduler
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1647224241656-23ba1068-3f56-4907-885f-b97f60722aeb.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0)

流程图：<br />![Task runner.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1647495890007-e5f5e1aa-4e11-4ec7-bec2-4cedba04552c.png)

<a name="QmoJF"></a>
## 排查错误
<a name="L2FDJ"></a>

### 记录日志
场景1：上传文件时，报“ERR_CONNECTION_RESET”。<br />解决：在 goland 编辑器本地启动，查看日志，排查出是代码 proxy 代理的时候出现的错误（代码问题，并不是网上的一些总结经验，由此可见报错时，一定要去看日志排查问题）。


<a name="RTopS"></a>
## 测试

<a name="IOqPI"></a>

## 部署上云
编译脚本：<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2788589/1647911477253-bc72d17f-d749-4106-b44c-308e672ad945.png)
```go
nohup 命名：no hang up（不挂起），用于在系统后台不挂断地运行命令，退出终端不会影响程序的运行。
```

