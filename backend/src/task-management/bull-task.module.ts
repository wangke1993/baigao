import { Module } from '@nestjs/common';
import { RunTaskService } from './run-task.service';
import { CronTaskService } from './cron-task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EnvConfig } from 'src/utils/env-config';
import { CreateTaskService } from './create-task.service';
import { MemberManagementModule } from 'src/member-management/member-management.module';
import { WeChatApiModule } from 'src/wechat-api/wechat-api.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { BullModule } from '@nestjs/bull';
import { SYS_TASK_QUEUE_NAME } from './dto/static-param';
import { BullTaskProcessor } from './bull-task.processor';
import { BullTaskService } from './bull-task.service';
const envConfig = new EnvConfig();
@Module({
    imports: [
        BullModule.registerQueueAsync({
            name: SYS_TASK_QUEUE_NAME,
            useFactory: () => ({
                redis: {
                    host: envConfig.REDIS_HOST,
                    port: Number(envConfig.REDIS_LINK_PORT),
                    password: envConfig.REDIS_PASSWD,
                },
                prefix: `${envConfig.ENV}_`
            })
        }),
    ],
    providers: [BullTaskService],
    exports: [BullTaskService],
    controllers: []
})
export class BullTaskModule { }
