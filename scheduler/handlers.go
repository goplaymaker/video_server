package main

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"video_server/scheduler/dbops"
)

func vidDelRecHandler(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	vid := p.ByName("vid-id")
	log.Println(vid)

	if len(vid) == 0 {
		sendResponse(w, 400, "video id should not be empty")
		return
	}
	err := dbops.AddVideoDeletionRecord(vid)
	if err != nil {
		sendResponse(w, 500, "Internal server error")
		return
	}

	sendResponse(w, 200, "ok")
	return
}
