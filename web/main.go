package main

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
)

func RegisterHandler() *httprouter.Router {
	router := httprouter.New()

	router.GET("/", homeHandler)
	router.POST("/", homeHandler)

	router.GET("/userhome", userHomeHandler)
	router.POST("/userhome", userHomeHandler)

	router.GET("/test", testHandler)

	router.POST("/api", apiHandler)

	router.POST("/upload/:vid-id", proxyHandler)
	router.GET("/videos/:vid-id", proxyHandler)

	// 静态资源映射
	router.ServeFiles("/statics/*filepath", http.Dir("./templates"))

	return router
}

func main() {
	r := RegisterHandler()

	log.Println("web ok...")
	http.ListenAndServe(":8080", r)
}
