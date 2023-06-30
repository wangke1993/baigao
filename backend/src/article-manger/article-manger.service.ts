import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { ArticleManger, ArticleMangerDocument } from './dto/article-manger.schema';
import { ArticlePageForm } from './dto/article-page-form';

@Injectable()
export class ArticleMangerService {
    private readonly logger = new Logger(ArticleMangerService.name);
    constructor(
        @InjectModel(ArticleManger.name) private ArticleMangerModel: Model<ArticleMangerDocument>,
        private fileUploadService: FileUploadService
    ) { };


    async deleteById(id: string): Promise<any> {
        const article = await this.ArticleMangerModel.findOne({ _id: new ObjectId(id) });
        if (article) {
            // 删除文件
            article.fileIds.forEach(k => {
                try {
                    this.fileUploadService.delete(k)
                } catch (error) {
                    this.logger.error(error);
                }
            })
        } else {
            throw new Error("文章不存在");
        }
        return this.ArticleMangerModel.deleteOne({ _id: new ObjectId(id) });
    }
    async create(articleManger: ArticleManger, req: any): Promise<ArticleManger> {
        articleManger.updateUser = req?.user?.userName;
        articleManger.updateDate = new Date();
        articleManger.addUser = req?.user?.userName;
        articleManger.addDate = new Date();
        return new this.ArticleMangerModel(articleManger).save();
    }
    async update(articleManger: ArticleManger, id: string, req: any): Promise<any> {
        articleManger.updateUser = req?.user?.userName;
        articleManger.updateDate = new Date();
        delete articleManger.addDate;
        delete articleManger.addUser;
        return await this.ArticleMangerModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...articleManger } });
    }
    async getPage(pageForm: ArticlePageForm, signUpUser?: string): Promise<PageResponseDto<ArticleManger>> {
        const keyWord = pageForm?.keyWord ? pageForm?.keyWord : '';
        let map: any = {
            $or: [
                { articleName: { $regex: keyWord } },
                { syn: { $regex: keyWord } },
                { content: { $regex: keyWord } }
            ]
        };
        if (pageForm.articleClass) {
            map.articleClass = pageForm.articleClass;
        }
        if (pageForm.isRelease == 1) {
            map.release = true;
        }
        if (pageForm.isRelease == 2) {
            map.release = false;
        }
        if (signUpUser) {
            map.signUpUsers = signUpUser;
        }
        const pageData = new PageResponseDto<ArticleManger>();
        pageData.total = await this.ArticleMangerModel.countDocuments(map, { content: 0 });
        pageData.list = await this.ArticleMangerModel.find(map, { content: 0 }).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize).sort({ updateDate: -1 });
        return pageData;
    }
    async getDetailById(id: string, isRelease?: boolean): Promise<ArticleManger> {
        let map: any = { _id: new ObjectId(id) }
        if (isRelease) {
            map.release = isRelease;
        }
        return await this.ArticleMangerModel.findOne(map);
    }
    async getByIds(ids: string[]): Promise<ArticleManger[]> {
        const objectIds: ObjectId[] = [];
        ids.forEach(id => {
            objectIds.push(new ObjectId(id));
        });
        let map: any = { _id: { $in: objectIds } };
        return await this.ArticleMangerModel.find(map);
    }
}
