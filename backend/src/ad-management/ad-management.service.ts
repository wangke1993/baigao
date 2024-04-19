import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { AdManagement, AdManagementDocument } from './dto/ad-management.schema';
import { AdPageForm } from './dto/ad-page-form';
import { Logger } from '@nestjs/common';

@Injectable()
export class AdManagementService {
    private readonly logger = new Logger(AdManagementService.name);
    constructor(
        @InjectModel(AdManagement.name) private AdManagementModel: Model<AdManagementDocument>,
        private fileUploadService: FileUploadService
    ) { };


    async deleteById(id: string): Promise<any> {
        const ad = await this.AdManagementModel.findOne({ _id: new ObjectId(id) });
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
        return this.AdManagementModel.deleteOne({ _id: new ObjectId(id) });
    }
    async create(adManagement: AdManagement, req: any): Promise<AdManagement> {
        adManagement.updateUser = req?.user?.userName;
        adManagement.updateDate = new Date();
        adManagement.addUser = req?.user?.userName;
        adManagement.addDate = new Date();
        return new this.AdManagementModel(adManagement).save();
    }
    async update(adManagement: AdManagement, id: string, req: any): Promise<any> {
        adManagement.updateUser = req?.user?.userName;
        adManagement.updateDate = new Date();
        delete adManagement.addDate;
        delete adManagement.addUser;
        return await this.AdManagementModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...adManagement } });
    }
    async getPage(pageForm: AdPageForm): Promise<PageResponseDto<AdManagement>> {
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
        const pageData = new PageResponseDto<AdManagement>();
        pageData.total = await this.AdManagementModel.countDocuments(map);
        pageData.list = await this.AdManagementModel.find(map).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize).sort({ sort: 1 });
        return pageData;
    }
    async getList(): Promise<AdManagement[]> {
        return await this.AdManagementModel.find({ release: true }).sort({ sort: 1, addDate: -1, updateDate: -1 });
    }
}
