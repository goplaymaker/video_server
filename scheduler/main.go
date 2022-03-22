package main

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"video_server/scheduler/taskrunner"
)

func RegisterHandlers() *httprouter.Router {
	router := httprouter.New()

	router.GET("/video-delete-record/:vid-id", vidDelRecHandler)

	return router
}

func main() {
	// 开启 task runner
	go taskrunner.Start()
	// 注册 http handlers
	r := RegisterHandlers()
	log.Println("scheduler ok...")
	http.ListenAndServe(":9001", r)
}
