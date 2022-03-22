package taskrunner

const (
	READY_TO_DISPATCH = "d"
	READY_TO_EXECUTE  = "e"
	CLOSE             = "c"
	VIDEO_DIR         = "D:\\learn-area\\go-wp\\video_server\\videos\\"
)

// controlChan 控制管道
type controlChan chan string

// dataChan 数据管道
type dataChan chan interface{}

type fn func(dc dataChan) error
