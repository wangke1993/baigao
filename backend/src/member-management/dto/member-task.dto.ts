import { TaskDto } from "src/task-management/dto/task.dto"

const TASK_TAG = 'member_task';
export class MemberTaskDto extends TaskDto<MemberTaskCommand> {
    constructor(UUID: string, type: MEMBER_TASK_TYPE, socketId: string, msg?: string) {
        super();
        this.tag = TASK_TAG;
        this.message = msg;
        this.data = new MemberTaskCommand();
        this.data.UUID = UUID;
        this.data.type = type;
        this.data.typeText = MEMBER_TASK_TYPE_TEXT[type];
        this.data.data = socketId;
    }
}
export const isMemberTask = (t: TaskDto<any>) => {
    return t.tag === TASK_TAG;
}
export enum MEMBER_TASK_TYPE {
    '上线' = 1,
    '下线' = 2,
}
const MEMBER_TASK_TYPE_TEXT = {
    1: '用户上线',
    2: '用户下线',
}
export class MemberTaskCommand {
    /**
     * 命令类型
     */
    type: string | MEMBER_TASK_TYPE;
    typeText: string;
    /**
     * 会员UUID
     */
    UUID: string;
    /**
     * 传输数据
     */
    data: any;
}
