import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { SystemConfigController } from './system-config.controller';
import { SystemConfigService } from './system-config.service';
import { SystemConfig, SystemConfigSchema } from './dto/system-config.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: SystemConfig.name, schema: SystemConfigSchema }]), SystemLogModule],
    providers: [SystemConfigService],
    exports: [SystemConfigService],
    controllers: [SystemConfigController]
})
export class SystemConfigModule { }
