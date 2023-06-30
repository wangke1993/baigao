
// 库存销量相关任务
export class GoodsTask {
    cmdType: GOODS_TASK_TYPE;  // 操作类型
    goodsUUID: string; // 商品UUID
}
export enum GOODS_TASK_TYPE {
    '创建抽奖阶段' = 1,
    '删除抽奖阶段' = 2,
}