import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WxMPApiService } from 'src/wechat-api/wx-mp-api.service';
import { WxTaskService } from 'src/wechat-api/wx-task.service';
@Injectable()
export class CronTaskService implements OnApplicationBootstrap {
    private readonly logger = new Logger(CronTaskService.name);
    constructor(
        private wxTaskService: WxTaskService
    ) { };

    /**
     * Cron表达式生成
     * 文档参考：https://nestjs.bootcss.com/techniques/task-scheduling
     */

    /**
     * 每月1号0点,执行一次
     */
    @Cron(
        CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT,
        { timeZone: "Asia/Shanghai" }
    )
    async atMidnightOnTheFirstDayOfEachMonth() {
        this.logger.log("每月执行一次");
        // this.orderTaskService.runMonth();
    }

    @Cron(
        CronExpression.EVERY_DAY_AT_MIDNIGHT,
        { timeZone: "Asia/Shanghai" }
    )
    async everyDayAt() {
        this.logger.log("每天零点执行一次");
        this.wxTaskService.runDay();
    }

    onApplicationBootstrap() {
        // 项目启动就执行一次
        // this.atMidnightOnTheFirstDayOfEachMonth();
    }
}
