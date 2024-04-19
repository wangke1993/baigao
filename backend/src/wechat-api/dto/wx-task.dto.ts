import { TaskDto } from "src/task-management/dto/task.dto"

const TASK_TAG = 'wx_task';
export class WxTaskDto extends TaskDto<WxTaskCommand> {
    constructor(type: WX_TASK_TYPE, msg?: string) {
        super();
        this.tag = TASK_TAG;
        this.message = msg;
        this.data = new WxTaskCommand();
        this.data.type = type;
        this.data.typeText = WX_TASK_TYPE_TEXT[type];
    }
}
export const isWxTask = (t: TaskDto<any>) => {
    return t.tag === TASK_TAG;
}
export enum WX_TASK_TYPE {
    '拉取微信公众号订阅用户' = 1,
}
const WX_TASK_TYPE_TEXT = {
    1: '拉取微信公众号订阅用户',
}
export class WxTaskCommand {
    /**
     * 任务类型
     */
    type: WX_TASK_TYPE;

    /**
     * 任务类型名称
     */
    typeText: String;
}
