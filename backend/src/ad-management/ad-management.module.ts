import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { AdManagementController } from './ad-management.controller';
import { AdManagementService } from './ad-management.service';
import { AdManagement, AdManagementSchema } from './dto/ad-management.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: AdManagement.name, schema: AdManagementSchema }]), SystemLogModule, FileUploadModule],
    providers: [AdManagementService],
    exports: [AdManagementService],
    controllers: [AdManagementController]
})
export class AdManagementModule { }
