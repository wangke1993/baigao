
// 库存销量相关任务
export class StockTask {
    cmdType: STOCK_TASK_TYPE;  // 操作类型
    distributorUUID: string; // 经销商UUID
}
export enum STOCK_TASK_TYPE {
    '库存变更' = 1,
    '销量变更' = 2,
    '抽奖销量变更' = 3
}