import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { AdMangerController } from './ad-manger.controller';
import { AdMangerService } from './ad-manger.service';
import { AdManger, AdMangerSchema } from './dto/ad-manger.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: AdManger.name, schema: AdMangerSchema }]), SystemLogModule, FileUploadModule],
    providers: [AdMangerService],
    exports: [AdMangerService],
    controllers: [AdMangerController]
})
export class AdMangerModule { }
