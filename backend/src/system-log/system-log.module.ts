import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { SystemLogController } from './system-log.controller';
import { SystemLog, SystemLogSchema } from './dto/system-log.schema';
import { SystemLogService } from './system-log.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: SystemLog.name, schema: SystemLogSchema }])],
    providers: [SystemLogService],
    exports: [SystemLogService],
    controllers: [SystemLogController]
})
export class SystemLogModule { }
