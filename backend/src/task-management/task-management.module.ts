import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from 'src/transaction/transaction.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { CreateTaskService } from './create-task.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EnvConfig } from 'src/utils/env-config';
import { TaskTestController } from './task-test.controller';
const envConfig = new EnvConfig();
@Module({
    imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            useFactory: () => {
                return {
                    exchanges: [
                        {
                            name: 'baigao-task-exchange',
                            type: 'x-delayed-message',
                            options: {
                                arguments: { 'x-delayed-type': 'direct' }
                            }
                        }
                    ],
                    uri: envConfig.RABBIT_URL,
                    enableControllerDiscovery: true,
                }
            }
        }),
        TransactionModule,
        SystemLogModule,
        FileUploadModule
    ],
    providers: [CreateTaskService],
    exports: [CreateTaskService],
    controllers: [TaskTestController]
})
export class TaskManagementModule { }
