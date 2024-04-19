import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from 'src/transaction/transaction.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { WithdrawalManagementController } from './withdrawal-management.controller';
import { WithdrawalManagementService } from './withdrawal-management.service';
import { WithdrawalManagement, WithdrawalManagementSchema } from './dto/withdrawal-management.schema';
import { WalletManagementModule } from 'src/wallet-management/wallet-management.module';
import { SystemConfigModule } from 'src/system-config/system-config.module';
import { WeChatApiModule } from 'src/wechat-api/wechat-api.module';
import { MemberManagementModule } from 'src/member-management/member-management.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: WithdrawalManagement.name, schema: WithdrawalManagementSchema }]),
        TransactionModule,
        SystemLogModule,
        FileUploadModule,
        WalletManagementModule,
        SystemConfigModule,
        WeChatApiModule,
        MemberManagementModule
    ],
    providers: [WithdrawalManagementService],
    exports: [WithdrawalManagementService],
    controllers: [WithdrawalManagementController]
})
export class WithdrawalManagementModule { }
