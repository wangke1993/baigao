import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeChatApiModule } from 'src/wechat-api/wechat-api.module';
import { DelayTaskService } from './delay-task.service';
import { TaskMangerService } from './task-manger.service';
const configService = new ConfigService();
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'baigao-task-exchange',
          type: 'direct',
        }
      ],
      uri: configService.get<string>('RABBIT_URL'),
      enableControllerDiscovery: true,
    }),
    WeChatApiModule,
  ],
  providers: [DelayTaskService, TaskMangerService]
})
export class DelayTaskModule { }