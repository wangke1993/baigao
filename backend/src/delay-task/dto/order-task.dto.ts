
// 订单相关延迟任务
export class OrderTask {
    cmdType: ORDER_TASK_TYPE;  // 操作类型
    orderId: string; // 订单id
}
export enum ORDER_TASK_TYPE {
    '支付超时' = 1,
    '收货超时' = 2,
    '订单取消退款' = 3,
    '恢复钱包冻结资金' = 5,
    '订单分销' = 4
}