import { BeforeApplicationShutdown, Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { UUID } from 'src/utils/random-tools';
import { WxTaskService } from 'src/wechat-api/wx-task.service';
const CRON_TASK_KEY = 'CRON_TASK_WORKER_ID';
@Injectable()
export class CronTaskService implements OnApplicationBootstrap {
    private readonly logger = new Logger(CronTaskService.name);
    static workerID = UUID();

    constructor(
        private wxTaskService: WxTaskService,
        private redisCacheService: RedisCacheService,
    ) { };
    async CanWorker(): Promise<Boolean> {
        const worker = await this.redisCacheService.get(CRON_TASK_KEY);
        if (worker) {
            return worker == CronTaskService.workerID;
        } else {
            await this.redisCacheService.set(CRON_TASK_KEY, CronTaskService.workerID);
            return await this.CanWorker();
        }
    }
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
        if (await this.CanWorker()) {
            this.logger.log("每月执行一次");
        } else {
            this.logger.log("每月执行一次，当前副本无权执行");
        }
    }

    @Cron(
        CronExpression.EVERY_DAY_AT_MIDNIGHT,
        { timeZone: "Asia/Shanghai" }
    )
    async everyDayAt() {
        if (await this.CanWorker()) {
            this.logger.log("每天零点执行一次");
            await this.wxTaskService.runDay();
        } else {
            this.logger.log("每天零点执行一次，当前副本无权执行");
        }
    }
    onApplicationBootstrap() {
        this.redisCacheService.set(CRON_TASK_KEY, CronTaskService.workerID);
        setTimeout(() => {
            // 启动就执行一次,延迟8s执行
            this.atMidnightOnTheFirstDayOfEachMonth();
            this.everyDayAt();
        }, 5000);
    }
}

