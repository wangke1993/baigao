import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { MemberTaskService } from 'src/member-management/member-task.service';

@Injectable()
export class RunTaskService {
    private readonly logger = new Logger(RunTaskService.name);
    constructor(
        private memberTaskService: MemberTaskService
    ) { };

    @RabbitSubscribe({
        exchange: 'baigao-task-exchange',
        routingKey: 'bg-task',
        queue: 'baigao-task',
    })
    public async handlerTask(task: TaskDto<any>) {
        this.logger.debug(`收到任务`, task);
        /**
         * 通知所有任务,任务中的run通过注解过滤，获取自己的消息
         */
        await this.memberTaskService.run(task);
    }
}
