import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { AdManger, AdMangerDocument } from './dto/ad-manger.schema';
import { AdPageForm } from './dto/ad-page-form';
import { Logger } from '@nestjs/common';

@Injectable()
export class AdMangerService {
    private readonly logger = new Logger(AdMangerService.name);
    constructor(
        @InjectModel(AdManger.name) private AdMangerModel: Model<AdMangerDocument>,
        private fileUploadService: FileUploadService
    ) { };


    async deleteById(id: string): Promise<any> {
        const ad = await this.AdMangerModel.findOne({ _id: new ObjectId(id) });
        if (ad) {
            // 删除文件
            ad.fileIds.forEach(k => {
                try {
                    this.fileUploadService.delete(k)
                } catch (error) {
                    this.logger.error(error);
                }
            })
        } else {
            throw new Error(`广告不存在:${id}`);
        }
        return this.AdMangerModel.deleteOne({ _id: new ObjectId(id) });
    }
    async create(adManger: AdManger, req: any): Promise<AdManger> {
        adManger.updateUser = req?.user?.userName;
        adManger.updateDate = new Date();
        adManger.addUser = req?.user?.userName;
        adManger.addDate = new Date();
        return new this.AdMangerModel(adManger).save();
    }
    async update(adManger: AdManger, id: string, req: any): Promise<any> {
        adManger.updateUser = req?.user?.userName;
        adManger.updateDate = new Date();
        delete adManger.addDate;
        delete adManger.addUser;
        return await this.AdMangerModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...adManger } });
    }
    async getPage(pageForm: AdPageForm): Promise<PageResponseDto<AdManger>> {
        const keyWord = pageForm?.keyWord ? pageForm?.keyWord : '';
        let map: any = {
            $or: [
                { adName: { $regex: keyWord } },
                { syn: { $regex: keyWord } },
                { content: { $regex: keyWord } }
            ]
        };
        if (pageForm.position) {
            map.position = pageForm.position;
        }
        if (pageForm.isRelease == 1) {
            map.release = true;
        }
        if (pageForm.isRelease == 2) {
            map.release = false;
        }
        const pageData = new PageResponseDto<AdManger>();
        pageData.total = await this.AdMangerModel.countDocuments(map);
        pageData.list = await this.AdMangerModel.find(map).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize).sort({ sort: 1 });
        return pageData;
    }
    async getList(): Promise<AdManger[]> {
        return await this.AdMangerModel.find({ release: true }).sort({ sort: 1, addDate: -1, updateDate: -1 });
    }
}
