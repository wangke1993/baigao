import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from 'src/transaction/transaction.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { WalletManagementController } from './wallet-management.controller';
import { WalletManagementService } from './wallet-management.service';
import { WalletManagement, WalletManagementSchema } from './dto/wallet-management.schema';
import { WalletLog, WalletLogSchema } from './dto/wallet-log.schema';
import { WalletLogService } from './wallet-log.service';
import { WalletLogController } from './wallet-log.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: WalletManagement.name, schema: WalletManagementSchema }]),
        MongooseModule.forFeature([{ name: WalletLog.name, schema: WalletLogSchema }]),
        TransactionModule,
        SystemLogModule,
        FileUploadModule
    ],
    providers: [WalletManagementService, WalletLogService],
    exports: [WalletManagementService, WalletLogService],
    controllers: [WalletManagementController, WalletLogController]
})
export class WalletManagementModule { }
