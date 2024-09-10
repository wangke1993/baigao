import { Job, Queue } from "bull";
export const JOB_HANDLE: any = {};
export class BullTaskDto {
    constructor(job: Job) {
        this.job = job;
    }

    get id() {
        return this.job.id;
    }
    job: Job;
    /**
     * 警告！！！
     * 不可用于实际业务，重启后失效无法继续处理消息
     * 收到任务时进行业务处理
     * @param fn 处理函数
     */
    async handle<T>(fn: (data: T, job: Job<T>) => Promise<void>) {
        this.job.queue.process(`${this.job.id}`, async (job) => {
            if (job.id == this.job.id) {
                await fn(job.data, job);
            }
        });
    }
    /**
     * 任务完成
     * @param fn 处理函数
     */
    async isCompleted(fn: (job: Job) => Promise<void>) {
        this.job.queue.on("completed", async (job) => {
            if (job.id == this.job.id) {
                await fn(job);
            }
        });
    }

}