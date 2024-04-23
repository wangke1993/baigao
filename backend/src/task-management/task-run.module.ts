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
const envConfig = new EnvConfig();
@Module({
    imports: [
        ScheduleModule.forRoot(),
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            useFactory: () => {
                return {
                    uri: envConfig.RABBIT_URL,
                    enableControllerDiscovery: true,
                }
            },
        }),
        MemberManagementModule,
        WeChatApiModule,
        RedisCacheModule
    ],
    providers: [CronTaskService, CreateTaskService, RunTaskService],
    exports: [CronTaskService, RunTaskService],
    controllers: []
})
export class TaskRunModule { }
