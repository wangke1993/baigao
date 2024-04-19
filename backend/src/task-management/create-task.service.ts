import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { formatDate } from 'src/utils/date-tools';

@Injectable()
export class CreateTaskService {
    private readonly logger = new Logger(CreateTaskService.name);
    constructor(
        private readonly amqpConnection: AmqpConnection
    ) {
    };
    /**
     * 运行任务
     * @param data 任务数据
     * @param expiration 延迟时间（秒）
     * @param routeKey 队列路由键
     */
    async createTask(data: TaskDto<any>, expiration?: number, routeKey: string = "bg-task",) {
        if (expiration) {
            expiration = Math.ceil(expiration);
            const runTime = new Date((new Date().getTime() + Number(expiration * 1000)));
            this.logger.debug(`创建延时任务,将在${(expiration / 60 / 60).toFixed(2)}h后${formatDate(runTime)}通知运行`)
            this.logger.debug({ data, expiration });
        } else {
            this.logger.debug('创建立即执行任务', { data });
        }
        if (expiration) {
            this.amqpConnection.publish(
                'baigao-task-exchange',
                routeKey,
                data,
                {
                    headers: { 'x-delay': expiration * 1000 }
                })
        } else {
            this.amqpConnection.publish(
                'baigao-task-exchange',
                routeKey,
                data
            )
        }
    }
    /**
     * 指定运行日期任务
     * @param data 
     * @param startTime 
     */
    createTaskByDate(data: TaskDto<any>, startTime: Date, now = new Date()) {
        if (startTime.getTime() > now.getTime()) {
            const expiration = (startTime.getTime() - now.getTime()) / 1000;
            // 延迟expiration秒后运行
            this.createTask(data, expiration);
        } else {
            // 立即运行
            this.createTask(data);
        }
    };
}
