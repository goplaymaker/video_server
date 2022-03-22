package taskrunner

type Runner struct {
	Controller controlChan
	Error      controlChan
	Data       dataChan
	dataSize   int
	longLived  bool
	Dispatcher fn
	Executor   fn
}

// NewRunner 创建一个 runner
func NewRunner(size int, longLived bool, d fn, e fn) *Runner {
	return &Runner{
		Controller: make(chan string, 1),
		Error:      make(chan string, 1),
		Data:       make(chan interface{}, size),
		dataSize:   size,
		longLived:  longLived,
		Dispatcher: d,
		Executor:   e,
	}
}

// startDispatch 启动一个 runner
func (r *Runner) startDispatch() {
	// 退出时, 关闭相应资源
	defer func() {
		// 该 runner 不为长期支持的, 需要回收资源
		if !r.longLived {
			close(r.Controller)
			close(r.Error)
			close(r.Data)
		}
	}()

	// 读取 Controller 和 Error 管道, 从而进行任务分发处理
	for {
		// select
		select {
		case c := <-r.Controller:
			// dispatch
			if c == READY_TO_DISPATCH {
				err := r.Dispatcher(r.Data)
				if err != nil {
					r.Error <- CLOSE
				} else {
					// 消费一个即, 通知执行器
					r.Controller <- READY_TO_EXECUTE
				}
			}
			// executor
			if c == READY_TO_EXECUTE {
				err := r.Executor(r.Data)
				if err != nil {
					r.Error <- CLOSE
				} else {
					// 消费一个即, 通知分发器
					r.Controller <- READY_TO_DISPATCH
				}
			}
		case e := <-r.Error:
			// 遇到错误，终止任务
			if e == CLOSE {
				return
			}
		default:
			// do nothing
		}
	}
}

// StartAll 启动 runner
func (r *Runner) StartAll() {
	// 引子, 分配一个任务先
	r.Controller <- READY_TO_DISPATCH
	r.startDispatch()
}
