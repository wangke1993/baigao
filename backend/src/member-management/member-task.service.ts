import { Injectable, Logger } from "@nestjs/common";
import { TaskRunService } from "src/task-management/dto/task-service.interface";
import { TaskDto } from "src/task-management/dto/task.dto";
import { MEMBER_TASK_TYPE, MemberTaskCommand } from "./dto/member-task.dto";
import { MemberManagementService } from "./member-management.service";
import { IsMemberTask } from "src/decorator/is-member-task.decorator";

/**
 * 任务防抖
 */
const antiShake: TaskDto<MemberTaskCommand>[] = [];
@Injectable()
export class MemberTaskService implements TaskRunService {
    private readonly logger = new Logger(MemberTaskService.name);
    private readonly req = { userName: '系统-会员任务' }

    constructor(
        private memberManagementService: MemberManagementService,
    ) { }
    runDay(): void {

    }

    @IsMemberTask()
    async run(task: TaskDto<MemberTaskCommand>): Promise<void> {
        antiShake.push(task);
        const runTask = async () => {
            if (antiShake.length > 0) {
                const { data } = antiShake.pop();
                const start = new Date();
                switch (data.type) {
                    case MEMBER_TASK_TYPE.上线:
                        await this.memberManagementService.updateOnlineStatus(data.UUID, data.data, this.req);
                        break;
                    case MEMBER_TASK_TYPE.下线:
                        await this.memberManagementService.updateOnlineStatus(data.UUID, "", this.req);
                        break;
                }
                this.logger.log(`耗时：${((new Date().getTime() - start.getTime()) / 1000).toFixed(2)}s`)
                await runTask();
            }
        }
        await runTask();
    }
    runMonth(): void {

    }
}