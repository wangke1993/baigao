import { Injectable, Logger } from "@nestjs/common";
import { TaskRunService } from "src/task-management/dto/task-service.interface";
import { TaskDto } from "src/task-management/dto/task.dto";
import { WX_TASK_TYPE, WxTaskCommand } from "./dto/wx-task.dto";
import { IsWxTask } from "src/decorator/is-wx-task.decorator";
import { WxMPApiService } from "./wx-mp-api.service";

/**
 * 任务防抖
 */
const antiShake: any = {};
@Injectable()
export class WxTaskService implements TaskRunService {
    private readonly logger = new Logger(WxTaskService.name);
    private readonly req = { userName: '系统-微信任务' }
    constructor(
        private wxMPApiService: WxMPApiService
    ) { }

    @IsWxTask()
    async run(task: TaskDto<WxTaskCommand>): Promise<void> {
        const { data } = task;
        antiShake.push(task);
        const runTask = async () => {
            if (antiShake.length > 0) {
                const { data } = antiShake.pop();
                const start = new Date();
                // this.logger.log('运行订单任务', { task });
                switch (data.type) {
                    // case WX_TASK_TYPE.拉取微信公众号订阅用户:
                    //     await this.orderBillingService.serviceOrderDeductionByTask(data.UUID, this.req);
                    //     break;
                }
                this.logger.log(`耗时：${((new Date().getTime() - start.getTime()) / 1000).toFixed(2)}s`)
                await runTask();
            }
        }
        await runTask();

    }
    async runMonth(): Promise<void> {

    }
    async runDay(): Promise<void> {
        // 每天0点拉取一次微信公众号用户
        // TODO 根据业务情况看决定是否开启
        // this.wxMPApiService.getAllMpUserInfo(this.req);
    }
}