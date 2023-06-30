import { AmqpConnection, Nack, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { TASK_TYPE } from './dto/task.dto';
import { TaskMangerService } from './task-manger.service';

@Injectable()
export class DelayTaskService {
    private readonly logger = new Logger(DelayTaskService.name);
    constructor(
        private readonly taskMangerService: TaskMangerService
    ) {

    }
    @RabbitSubscribe({
        exchange: 'baigao-task-exchange',
        routingKey: 'bg-task',
        queue: 'baigao-task',
    })
    public async handlerTask(res: any) {
        this.logger.log(`收到任务${JSON.stringify(res)}`);
        if (res?.taskType) {
            const { taskType, data } = res;
            if (taskType == TASK_TYPE.订单处理) {
                this.taskMangerService.handlerOrderTask(data);
            }
            else if (taskType == TASK_TYPE.库存或销量处理) {
                this.taskMangerService.handlerStockTask(data);
            } else if (taskType == TASK_TYPE.商品相关) {
                this.taskMangerService.handlerGoodsTask(data);
            }else{
                this.logger.warn(`未知任务: ${JSON.stringify(res)}`);
            }
        } else {
            this.logger.error(`任务数据异常: ${JSON.stringify(res)}`);
        }
    }

}