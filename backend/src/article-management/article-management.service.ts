import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { ArticleManagement, ArticleManagementDocument } from './dto/article-management.schema';
import { ArticlePageForm } from './dto/article-page-form';

@Injectable()
export class ArticleManagementService {
    private readonly logger = new Logger(ArticleManagementService.name);
    constructor(
        @InjectModel(ArticleManagement.name) private ArticleManagementModel: Model<ArticleManagementDocument>,
        private fileUploadService: FileUploadService
    ) { };


    async deleteById(id: string): Promise<any> {
        const article = await this.ArticleManagementModel.findOne({ _id: new ObjectId(id) });
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
        return this.ArticleManagementModel.deleteOne({ _id: new ObjectId(id) });
    }
    async create(articleManagement: ArticleManagement, req: any): Promise<ArticleManagement> {
        articleManagement.updateUser = req?.user?.userName;
        articleManagement.updateDate = new Date();
        articleManagement.addUser = req?.user?.userName;
        articleManagement.addDate = new Date();
        return new this.ArticleManagementModel(articleManagement).save();
    }
    async update(articleManagement: ArticleManagement, id: string, req: any): Promise<any> {
        articleManagement.updateUser = req?.user?.userName;
        articleManagement.updateDate = new Date();
        delete articleManagement.addDate;
        delete articleManagement.addUser;
        return await this.ArticleManagementModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...articleManagement } });
    }
    async getPage(pageForm: ArticlePageForm, signUpUser?: string): Promise<PageResponseDto<ArticleManagement>> {
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
        const pageData = new PageResponseDto<ArticleManagement>();
        pageData.total = await this.ArticleManagementModel.countDocuments(map, { content: 0 });
        pageData.list = await this.ArticleManagementModel.find(map, { content: 0 }).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize).sort({ updateDate: -1 });
        return pageData;
    }
    async getDetailById(id: string, isRelease?: boolean): Promise<ArticleManagement> {
        let map: any = { _id: new ObjectId(id) }
        if (isRelease) {
            map.release = isRelease;
        }
        return await this.ArticleManagementModel.findOne(map);
    }

    async getByIds(ids: string[]): Promise<ArticleManagement[]> {
        const objectIds: ObjectId[] = [];
        ids.forEach(id => {
            objectIds.push(new ObjectId(id));
        });
        let map: any = { _id: { $in: objectIds } };
        return await this.ArticleManagementModel.find(map);
    }
    async getList(articleClass?: String, count?: number, keyWord?: string): Promise<ArticleManagement[]> {
        const map: any = { release: true };
        if (articleClass) {
            map.articleClass = articleClass;
        }
        if (keyWord) {
            map['$or'] = [
                { articleName: { $regex: keyWord } },
                { syn: { $regex: keyWord } },
                { content: { $regex: keyWord } }
            ]
        }
        if (count) {
            return await this.ArticleManagementModel.find(map).limit(count);
        } else {
            return await this.ArticleManagementModel.find(map);
        }
    }
}
