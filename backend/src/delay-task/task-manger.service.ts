import { AmqpConnection, Nack, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { WeChatApiService } from 'src/wechat-api/wechat-api.service';
import { GoodsTask, GOODS_TASK_TYPE } from './dto/goods-task.dto';
import { OrderTask, ORDER_TASK_TYPE } from './dto/order-task.dto';
import { StockTask, STOCK_TASK_TYPE } from './dto/stock-task.dto';

@Injectable()
export class TaskMangerService {
    private readonly logger = new Logger(TaskMangerService.name);
    constructor(
        private readonly weChatApiService: WeChatApiService,
    ) {

    }
    async runOrderTask(orderTask: OrderTask) {
        const { cmdType, orderId } = orderTask;
        const orderTaskFunction: any = {};
        orderTaskFunction[ORDER_TASK_TYPE.订单取消退款] = async () => {
            await this.weChatApiService.refundsOrder(orderId, '订单取消', { user: { userName: '系统' } })
        }
        orderTaskFunction[ORDER_TASK_TYPE.恢复钱包冻结资金] = async () => {
            await this.weChatApiService.refundsOrder(orderId, '订单取消', { user: { userName: '系统' } }, true);
        }
        await orderTaskFunction[cmdType]();
    };
    async handlerOrderTask(orderTask: OrderTask) {
        try {
            await this.runOrderTask(orderTask);
        } catch (error) {
            this.logger.error('任务执行失败', orderTask, '错误信息：', error);
            // return new Nack(true);  //消息异常，重新排队
        }
    }
    async runStockTask(stockTask: StockTask) {
        const { cmdType, distributorUUID } = stockTask;
        const stockTaskFunction: any = {};
        stockTaskFunction[STOCK_TASK_TYPE.抽奖销量变更] = async () => {
            // await this.orderMangerService.setLuckDrawTotalSalesVolume();
        }
        await stockTaskFunction[cmdType]();
    };
    async handlerStockTask(stockTask: StockTask) {
        try {
            await this.runStockTask(stockTask);
        } catch (error) {
            this.logger.error('任务执行失败', stockTask, '错误信息：', error);
            // return new Nack(true);  //消息异常，重新排队
        }
    }
    async runGoodsTask(goodsTask: GoodsTask) {
        const { cmdType, goodsUUID } = goodsTask;
        const stockTaskFunction: any = {};
        await stockTaskFunction[cmdType]();
    };
    async handlerGoodsTask(goodsTask: GoodsTask) {
        try {
            await this.runGoodsTask(goodsTask);
        } catch (error) {
            this.logger.error('任务执行失败', goodsTask, '错误信息：', error);
            // return new Nack(true);  //消息异常，重新排队
        }
    }
}