package main

import (
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

type HomePage struct {
	Name string
}

type UserPage struct {
	Name string
}

func homeHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// cookie 判断是否登录
	cname, err1 := r.Cookie("username")
	sid, err2 := r.Cookie("session")

	// 未登录
	if err1 != nil || err2 != nil {
		p := &HomePage{Name: "Uname"}
		// 加载模板文件
		t, e := template.ParseFiles("./templates/index.html")
		if e != nil {
			log.Printf("Parsing template home.html error: %s", e)
			return
		}
		// 渲染模板
		t.Execute(w, p)
	}

	// 已登录
	if cname != nil && len(cname.Value) != 0 && sid != nil && len(sid.Value) != 0 {
		http.Redirect(w, r, "/userhome", http.StatusFound)
		return
	}
}

func testHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	io.WriteString(w, "不会这么惨吧!")
}

func userHomeHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// cookie 判断是否登录
	cname, err1 := r.Cookie("username")
	_, err2 := r.Cookie("session")

	// 未登录
	if err1 != nil || err2 != nil {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	// 读取表单提交时 username
	fname := r.FormValue("username")

	var p *UserPage
	// 已经登录
	if cname != nil && len(cname.Value) != 0 {
		p = &UserPage{Name: cname.Value}
	} else if len(fname) != 0 {
		p = &UserPage{Name: fname}
	}

	// 加载模板
	t, e := template.ParseFiles("./templates/userhome.html")
	if e != nil {
		log.Printf("Parsing userhome.html error: %s", e)
		return
	}
	// 渲染模板
	t.Execute(w, p)
}

// apiHandler 进行 POST 请求的转发( web service -> api service)
func apiHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// apiHandler 只处理 POST 请求
	if r.Method != http.MethodPost {
		re, _ := json.Marshal(ErrorRequestNotRecognized)
		io.WriteString(w, string(re))
		return
	}

	res, _ := ioutil.ReadAll(r.Body)
	apiBody := &ApiBody{}
	if err := json.Unmarshal(res, apiBody); err != nil {
		re, _ := json.Marshal(ErrorRequestBodyParseFailed)
		io.WriteString(w, string(re))
		return
	}

	defer r.Body.Close()
	log.Printf("apiHandler apiBody is:%s\n", apiBody)
	// 请求转发
	request(apiBody, w, r)
}

// proxyHandler 对请求进行重新包装,更改域名和端口,避免跨域
func proxyHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	u, _ := url.Parse("http://127.0.0.1:9000/")
	// 将请求的 url 前缀替换成 u 定义的域名端口
	proxy := httputil.NewSingleHostReverseProxy(u)
	proxy.ServeHTTP(w, r)
}
