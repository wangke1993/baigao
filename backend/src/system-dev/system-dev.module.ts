import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { SystemDevController } from './system-dev.controller';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
    imports: [TransactionModule],
    providers: [],
    exports: [],
    controllers: [SystemDevController]
})
export class SystemDevModule { }
