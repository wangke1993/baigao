import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateDelayTaskService } from './create-delay-task.service';
import { CreateDelayTaskController } from './delay-task.controller';
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
    })
  ],
  providers: [CreateDelayTaskService, CreateDelayTaskController],
  exports: [CreateDelayTaskService],
  controllers: [CreateDelayTaskController]
})
export class CreateDelayTaskModule { }