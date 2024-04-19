import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from 'src/transaction/transaction.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { MemberAddressController } from './member-address.controller';
import { MemberAddressService } from './member-address.service';
import { MemberAddress, MemberAddressSchema } from './dto/member-address.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MemberAddress.name, schema: MemberAddressSchema }]),
        TransactionModule,
        SystemLogModule,
        FileUploadModule
    ],
    providers: [MemberAddressService],
    exports: [MemberAddressService],
    controllers: [MemberAddressController]
})
export class MemberAddressModule { }
