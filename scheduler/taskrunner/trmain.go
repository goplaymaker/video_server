package taskrunner

import "time"

type Worker struct {
	// 定时器, 每隔 t 时间往它内部的通道中发送一个消息, 可以利用该特性, 每隔 t 时间做一件事
	ticker *time.Ticker
	// runner 工作对象
	runner *Runner
}

func NewWorker(interval time.Duration, r *Runner) *Worker {
	return &Worker{
		ticker: time.NewTicker(interval * time.Second),
		runner: r,
	}
}

func (w *Worker) startWorker() {
	for {
		select {
		case <-w.ticker.C:
			// 每隔一段时间启动一个 runner
			go w.runner.StartAll()
		}
	}
	//go w.runner.StartAll()
}

// Start 启动一个 worker
func Start() {
	// Start video file cleaning
	r := NewRunner(3, true, VideoClearDispatcher, VideoClearExecutor)
	w := NewWorker(3, r)
	w.startWorker()
}
