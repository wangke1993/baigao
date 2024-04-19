import { TaskDto } from "./task.dto";

export interface TaskRunService {
    /**
     * 常规任务通知
     * @param data 
     */
    run(data: TaskDto<any>): void;
    
    /**
     * 每月1号运行一次
     * @param data 
     */
    runMonth(): void;

    /**
     * 每天0点运行
     * @param data 
     */
    runDay(): void;
}