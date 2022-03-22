#! /bin/bash

# Build web UI
cd D:/learn-area/go-wp/video_server/web/
go build
cp D:/learn-area/go-wp/video_server/web/web.exe D:/learn-area/go-wp/bin/video_server_web_ui/
cp -R D:/learn-area/go-wp/video_server/templates D:/learn-area/go-wp/bin/video_server_web_ui/

# api
cd D:/learn-area/go-wp/video_server/api/
go build
cp D:/learn-area/go-wp/video_server/api/api.exe D:/learn-area/go-wp/bin/

# scheduler
cd D:/learn-area/go-wp/video_server/scheduler/
go build
cp D:/learn-area/go-wp/video_server/scheduler/scheduler.exe D:/learn-area/go-wp/bin/

# stream server
cd D:/learn-area/go-wp/video_server/streamserver/
go build
cp D:/learn-area/go-wp/video_server/streamserver/streamserver.exe D:/learn-area/go-wp/bin/
