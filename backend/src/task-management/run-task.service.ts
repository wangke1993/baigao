import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { MemberTaskService } from 'src/member-management/member-task.service';
import { EnvConfig } from 'src/utils/env-config';
const envConfig = new EnvConfig();
@Injectable()
export class RunTaskService {
    private readonly logger = new Logger(RunTaskService.name);
    constructor(
        private memberTaskService: MemberTaskService
    ) { };

    @RabbitSubscribe({
        exchange: `baigao-task-exchange-${envConfig.ENV}`,
        routingKey: `bg-task-${envConfig.ENV}`,
        queue: `baigao-task-${envConfig.ENV}`,
    })
    public async handlerTask(task: TaskDto<any>) {
        this.logger.debug(`收到任务`, task);
        /**
         * 通知所有任务,任务中的run通过注解过滤，获取自己的消息
         */
        await this.memberTaskService.run(task);
    }
}
