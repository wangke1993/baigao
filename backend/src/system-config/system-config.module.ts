import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { SystemConfigController } from './system-config.controller';
import { SystemConfigService } from './system-config.service';
import { SystemConfig, SystemConfigSchema } from './dto/system-config.schema';

/**
 * TODO 实现自定义配置，重构SystemConfig
 * 分组
 *  UUID
 *  分组名称
 *  标签名称
 *  标签链接
 * 分组元素关系
 *  分组UUID
 *  dicCode：不能重复
 */
@Module({
    imports: [MongooseModule.forFeature([{ name: SystemConfig.name, schema: SystemConfigSchema }]), SystemLogModule],
    providers: [SystemConfigService],
    exports: [SystemConfigService],
    controllers: [SystemConfigController]
})
export class SystemConfigModule { }
