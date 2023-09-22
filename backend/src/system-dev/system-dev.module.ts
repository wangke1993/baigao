import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { SystemDevController } from './system-dev.controller';
import { TransactionModule } from 'src/transaction/transaction.module';
import { SystemDevService } from './system-dev.service';
import { ModuleConf, ModuleConfSchema } from './dto/module-conf.schema';
import { ModuleField, ModuleFieldSchema } from './dto/module-field.schema';
import { ModuleSearch, ModuleSearchSchema } from './dto/module-search.schema';

@Module({
    imports: [
        TransactionModule,
        MongooseModule.forFeature([{ name: ModuleConf.name, schema: ModuleConfSchema }]),
        MongooseModule.forFeature([{ name: ModuleField.name, schema: ModuleFieldSchema }]),
        MongooseModule.forFeature([{ name: ModuleSearch.name, schema: ModuleSearchSchema }]),
    ],
    providers: [SystemDevService],
    exports: [SystemDevService],
    controllers: [SystemDevController]
})
export class SystemDevModule { }
