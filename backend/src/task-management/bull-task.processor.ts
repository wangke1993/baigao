import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ORDER_TIMEOUT_PROCESSOR, SYS_TASK_QUEUE_NAME } from './dto/static-param';
import { Logger } from '@nestjs/common';

@Processor(SYS_TASK_QUEUE_NAME)
export class BullTaskProcessor {
    logger = new Logger(BullTaskProcessor.name);
    private readonly req = { user: { userName: '系统-订单超时系统' } }
    constructor(
    ) { }

    /**
     * 超时订单处理器
     * @param job 
     */
    @Process(ORDER_TIMEOUT_PROCESSOR)
    async handle(job: Job<any>): Promise<void> {
        try {
            const { UUID } = job.data;
            // await this.orderService.cancelOrder(UUID, this.req, true);
        } catch (error) {
            this.logger.error(error.message);
        }
    }

    // @OnQueueCompleted()
    // onCompleted(job: Job<any>) {
    //     // 任务完成
    //     console.log('总线任务完成', job.data);
    // }
}