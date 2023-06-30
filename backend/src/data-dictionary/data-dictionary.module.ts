import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { DataDictionaryController } from './data-dictionary.controller';
import { DataDictionaryService } from './data-dictionary.service';
import { DataDictionary, DataDictionarySchema } from './dto/data-dictionary.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: DataDictionary.name, schema: DataDictionarySchema }]), SystemLogModule],
    providers: [DataDictionaryService],
    exports: [DataDictionaryService],
    controllers: [DataDictionaryController]
})
export class DataDictionaryModule { }
