import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { ArticleMangerController } from './article-manger.controller';
import { ArticleMangerService } from './article-manger.service';
import { ArticleManger, ArticleMangerSchema } from './dto/article-manger.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: ArticleManger.name, schema: ArticleMangerSchema }]), SystemLogModule, FileUploadModule],
    providers: [ArticleMangerService],
    exports: [ArticleMangerService],
    controllers: [ArticleMangerController]
})
export class ArticleMangerModule { }
