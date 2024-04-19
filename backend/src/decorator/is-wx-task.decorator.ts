/**
 * 判断任务是否是微信任务，是的话就执行，不是的话就忽略
 */

import { isWxTask } from "src/wechat-api/dto/wx-task.dto";


export const IsWxTask = () => {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            if (isWxTask(args[0])) {
                return originalMethod.apply(this, args);
            } else {
                return;
            }
        };
        return descriptor;
    };
};