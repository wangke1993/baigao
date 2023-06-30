import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { FileUpload, FileUploadSchema } from './dto/file-upload.schema';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: FileUpload.name, schema: FileUploadSchema }]),
        SystemLogModule,
        RedisCacheModule
    ],
    providers: [FileUploadService],
    exports: [FileUploadService],
    controllers: [FileUploadController]
})
export class FileUploadModule { }
