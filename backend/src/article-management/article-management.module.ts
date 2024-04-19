import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { ArticleManagementController } from './article-management.controller';
import { ArticleManagementService } from './article-management.service';
import { ArticleManagement, ArticleManagementSchema } from './dto/article-management.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: ArticleManagement.name, schema: ArticleManagementSchema }]), SystemLogModule, FileUploadModule],
    providers: [ArticleManagementService],
    exports: [ArticleManagementService],
    controllers: [ArticleManagementController]
})
export class ArticleManagementModule { }
