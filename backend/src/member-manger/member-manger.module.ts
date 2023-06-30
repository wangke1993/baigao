import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { MemberMangerController } from './member-manger.controller';
import { MemberMangerService } from './member-manger.service';
import { MemberManger, MemberMangerSchema } from './dto/member-manger.schema';
import { AddrManger, AddrMangerSchema } from './dto/addrs-manger.schema';
import { SystemConfigModule } from '../system-config/system-config.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
    imports: [
        TransactionModule,
        MongooseModule.forFeature([{ name: MemberManger.name, schema: MemberMangerSchema }]),
        MongooseModule.forFeature([{ name: AddrManger.name, schema: AddrMangerSchema }]),
        SystemLogModule,
        SystemConfigModule,
        FileUploadModule],
    providers: [MemberMangerService],
    exports: [MemberMangerService],
    controllers: [MemberMangerController]
})
export class MemberMangerModule { }
