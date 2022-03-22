package main

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"video_server/api/session"
)

type middleWareHandler struct {
	r *httprouter.Router
}

// duck type 模式: 在 Go 语言中, 一个 struct 实现了一个接口中的方法, 无需显示声明就会认为是这个接口类型
// 比如 middleWareHandler 实现了 ServeHTTP 方法, 那么 middleWareHandler 就是一个 http.Handler 类型
func newMiddleWareHandler(r *httprouter.Router) http.Handler {
	m := middleWareHandler{r}
	return m
}

// http.Handler 声明如下
//type Handler interface {
//	ServeHTTP(ResponseWriter, *Request)
//}
func (m middleWareHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// check session, 这个中间件的功能就是检查 session
	ValidateUserSession(r)
	/*ok := validateUser(w, r)
	if !ok {
		return
	}*/

	// 交由 httpRouter 进行处理
	m.r.ServeHTTP(w, r)
}

func RegisterHandlers() *httprouter.Router {
	router := httprouter.New()

	// 注册 handlers
	router.POST("/user", CreateUser)

	router.POST("/user/:username", Login)

	router.GET("/user/:username", GetUserInfo)

	router.POST("/user/:username/videos", AddNewVideo)

	router.GET("/user/:username/videos", ListAllVideos)

	router.DELETE("/user/:username/videos/:vid-id", DeleteVideo)

	router.POST("/videos/:vid-id/comments", PostComment)

	router.GET("/videos/:vid-id/comments", ShowComments)

	return router
}

func Prepare() {
	session.LoadSessionsFromDB()
}

func main() {
	Prepare()
	r := RegisterHandlers()
	// 自定义中间件,验证 session
	mw := newMiddleWareHandler(r)
	log.Println("api ok...")
	http.ListenAndServe(":8000", mw)
}
