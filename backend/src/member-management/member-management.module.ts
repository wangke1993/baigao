import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { MemberManagementController } from './member-management.controller';
import { MemberManagementService } from './member-management.service';
import { MemberManagement, MemberManagementSchema } from './dto/member-management.schema';
import { SystemConfigModule } from '../system-config/system-config.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { WalletManagementModule } from 'src/wallet-management/wallet-management.module';
import { TaskManagementModule } from 'src/task-management/task-management.module';
import { MemberTaskService } from './member-task.service';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
    imports: [
        TransactionModule,
        MongooseModule.forFeature([{ name: MemberManagement.name, schema: MemberManagementSchema }]),
        SystemLogModule,
        WalletManagementModule,
        SystemConfigModule,
        FileUploadModule,
        TaskManagementModule,
        RedisCacheModule
    ],
    providers: [MemberManagementService, MemberTaskService],
    exports: [MemberManagementService, MemberTaskService],
    controllers: [MemberManagementController]
})
export class MemberManagementModule { }
