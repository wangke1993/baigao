/**
 * 判断任务是否是会员模块任务，是的话就执行，不是的话就忽略
 */

import { isMemberTask } from "src/member-management/dto/member-task.dto";


export const IsMemberTask = () => {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            if (isMemberTask(args[0])) {
                return originalMethod.apply(this, args);
            } else {
                return;
            }
        };
        return descriptor;
    };
};