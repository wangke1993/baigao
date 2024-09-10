import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { formatDate } from 'src/utils/date-tools';
import { EnvConfig } from 'src/utils/env-config';
import { InjectQueue } from '@nestjs/bull';
import { SYS_TASK_QUEUE_NAME } from './dto/static-param';
import { Queue } from 'bull';
import { SnowflakeID, UUID } from 'src/utils/random-tools';
import { BullTaskDto } from './dto/bull-task.dto';
const envConfig = new EnvConfig();
@Injectable()
export class BullTaskService {
    private readonly logger = new Logger(BullTaskService.name);
    constructor(
        @InjectQueue(SYS_TASK_QUEUE_NAME) private bullQueue: Queue,
    ) {
    };
    /**
     * 创建任务
     * @param data 任务数据data必须是一个对象，否则无法送达
     * @param processorName 处理器名称
     * @param expiration 延迟时间（秒）
     * @param routeKey 队列路由键
     */
    async createTask(data: { [key: string]: any }, processorName: string, expiration?: number): Promise<BullTaskDto> {
        if (expiration) {
            expiration = Math.ceil(expiration);
            const runTime = new Date((new Date().getTime() + Number(expiration * 1000)));
            this.logger.debug(`创建BULL延时任务,将在${(expiration / 60 / 60).toFixed(2)}h后${formatDate(runTime)}通知运行`)
            this.logger.debug({ data, expiration });
        } else {
            this.logger.debug('创建BULL立即执行任务', { data });
        }
        let job = null;
        const jobId = UUID();
        if (expiration) {
            job = await this.bullQueue.add(
                processorName ?? jobId,
                data,
                {
                    jobId,
                    delay: expiration * 1000,
                },
            );
        } else {
            job = await this.bullQueue.add(
                processorName ?? jobId,
                data,
                {
                    jobId,
                },
            );
        }
        return new BullTaskDto(job);
    }
    /**
     * 指定运行日期任务
     * @param data 
     * @param startTime 
     */
    createTaskByDate(data: { [key: string]: any }, processorName: string, startTime: Date, now = new Date()): Promise<BullTaskDto> {
        if (startTime.getTime() > now.getTime()) {
            const expiration = (startTime.getTime() - now.getTime()) / 1000;
            // 延迟expiration秒后运行
            return this.createTask(data, processorName, expiration);
        } else {
            // 立即运行
            return this.createTask(data, processorName);
        }
    };
}
