import { AmqpConnection, Nack, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { GoodsTask } from './dto/goods-task.dto';
import { OrderTask, ORDER_TASK_TYPE } from './dto/order-task.dto';
import { StockTask, STOCK_TASK_TYPE } from './dto/stock-task.dto';
import { TASK_TYPE } from './dto/task.dto';

@Injectable()
export class CreateDelayTaskService {
    private readonly logger = new Logger(CreateDelayTaskService.name);
    constructor(private readonly amqpConnection: AmqpConnection) {

    }
    /**
     * 发送消息队列
     * @param taskType 
     * @param data 
     * @param expiration 
     */
    private async createTask(routeKey: string, taskType: TASK_TYPE | any, data: OrderTask | StockTask | any, expiration?: number) {
        if (expiration) {
            this.amqpConnection.publish(
                'baigao-task-exchange',
                routeKey,
                {
                    taskType,
                    data
                },
                {
                    expiration: expiration * 1000
                })
        } else {
            this.amqpConnection.publish(
                'baigao-task-exchange',
                routeKey,
                {
                    taskType,
                    data
                })
        }

    }
    /**
     * 创建订单任务
     * @param orderTask 任务详情
     * @param expiration 过期时间：s
     */
    public async orderTask(orderTask: OrderTask, expiration?: number): Promise<any> {
        try {
            // 立即执行的任务
            const bgTask = [
                ORDER_TASK_TYPE.订单取消退款,
                ORDER_TASK_TYPE.订单分销,
                ORDER_TASK_TYPE.恢复钱包冻结资金,
            ];
            if (orderTask.cmdType == ORDER_TASK_TYPE.支付超时) {
                this.createTask('pay-expire', TASK_TYPE.订单处理, orderTask, expiration);
            } else if (orderTask.cmdType == ORDER_TASK_TYPE.收货超时) {
                this.createTask('order-expire', TASK_TYPE.订单处理, orderTask, expiration);
            } else if (bgTask.includes(orderTask.cmdType)) {
                this.createTask('bg-task', TASK_TYPE.订单处理, orderTask);
            }
            this.logger.log(`创建任务【订单处理】：${JSON.stringify(orderTask)},过期时间:${expiration}s后`);
        } catch (error) {
            this.logger.log('任务创建失败', error, JSON.stringify(orderTask), expiration);
        }
    }
    /**
     * 创建库存销量变更任务
     * @param stockTask 任务变量
     */
    public async StockTask(stockTask: StockTask): Promise<any> {
        try {
            this.createTask('bg-task', TASK_TYPE.库存或销量处理, stockTask);
            this.logger.log(`创建任务【库存或销量处理】：${JSON.stringify(stockTask)}`);
        } catch (error) {
            this.logger.log('任务创建失败', error, JSON.stringify(stockTask));
        }
    }
    /**
     * 创建库存销量变更任务
     * @param goodsTask 任务变量
     */
     public async GoodsTask(goodsTask: GoodsTask): Promise<any> {
        try {
            this.createTask('bg-task', TASK_TYPE.商品相关, goodsTask);
            this.logger.log(`创建任务【商品相关】：${JSON.stringify(goodsTask)}`);
        } catch (error) {
            this.logger.log('任务创建失败', error, JSON.stringify(goodsTask));
        }
    }
}