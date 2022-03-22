package taskrunner

import (
	"errors"
	"log"
	"os"
	"sync"
	"video_server/scheduler/dbops"
)

// VideoClearDispatcher 找到待删除的电影 ID, 然后发到 channel 待执行器消费
func VideoClearDispatcher(dc dataChan) error {
	res, err := dbops.ReadVideoDeletionRecord(3)
	if err != nil {
		log.Printf("Video clear dispatcher error: %v", err)
		return err
	}

	if len(res) == 0 {
		return errors.New("all tasks finished")
	}

	for _, id := range res {
		dc <- id
	}
	return nil
}

// VideoClearExecutor 执行删除电影的工作
func VideoClearExecutor(dc dataChan) error {
	// 错误信息 map
	errMap := &sync.Map{}

flag:
	for {
		// 获取 dc 中的值(待删除的电影 ID), 然后做删除工作
		// select
		select {
		case vid := <-dc:
			// 启动一个 goroutine 进行删除操作
			// 需要传入参数, 而不是直接使用外部 vid(这可以叫做闭包吧?), 因为当 goroutine 真正启动时会使用当时瞬时的 vid
			// 而不是当初的 vid, 例如 vid = 1 时"启动"了 goroutine, 但可能到 vid = 10 时才真正的运行, 那么此时 vid = 10
			go func(id interface{}) {
				//log.Printf("delete vid = %s\n", id)
				// 删除文件
				if err := deleteVideo(vid.(string)); err != nil {
					errMap.Store(id, err)
					return
				}
				// 删除 video_del_rec 记录信息
				if err := dbops.DelVideoDeletionRecord(vid.(string)); err != nil {
					errMap.Store(id, err)
					return
				}
			}(vid)
		default:
			break flag
		}
	}

	// 处理错误信息
	var err error
	errMap.Range(func(key, value interface{}) bool {
		err = value.(error)
		if err != nil {
			// 遍历时返回 false 则退出
			return false
		} else {
			return true
		}
	})
	return err
}

// deleteVideo 删除文件信息
func deleteVideo(vid string) error {
	err := os.Remove(VIDEO_DIR + vid + ".mp4")
	//log.Printf("deleteVideo err: %v\n", err)
	if err != nil && !os.IsNotExist(err) {
		log.Printf("Deleting video error: %v", err)
		return err
	}
	return nil
}
