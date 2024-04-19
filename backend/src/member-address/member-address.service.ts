import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { MemberAddress, MemberAddressDocument } from './dto/member-address.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto';  
@Injectable()
export class MemberAddressService {
    private readonly logger = new Logger(MemberAddressService.name);
    constructor(
        @InjectModel(MemberAddress.name) private memberAddressModel: Model<MemberAddressDocument>,
        private fileUploadService: FileUploadService,
        private transactionHelper: TransactionHelper
    ) { };

    async create(data: MemberAddress, req: any): Promise<MemberAddress> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        data.addUser = req?.user?.userName;
        data.addDate = new Date();
        
        return new this.memberAddressModel(data).save();
    }

    async deleteById(id: string): Promise<any> {
        const data = await this.memberAddressModel.findOne({ _id: new ObjectId(id) });
        if (data) {
            // 删除文件
            data.fileIds.forEach(k => {
                try {
                    this.fileUploadService.delete(k)
                } catch (error) {
                    this.logger.error(error);
                }
            })
        } else {
            throw new Error("数据不存在");
        }
        return this.memberAddressModel.deleteOne({ _id: new ObjectId(id) });
    }

    async update(data: MemberAddress, id: string, req: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.memberAddressModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });
    }


    async getPage(page: PageRequestDto): Promise<PageResponseDto<MemberAddress>> {
        const keyWord = page?.keyWord ? page?.keyWord : '';
        
        const map: any = {
            $or: [
                
                { contacts: { $regex: keyWord } },
                
                { contactsPhone: { $regex: keyWord } },
                
            ]
        };
        
        const pageData = new PageResponseDto<MemberAddress>();
        pageData.total = await this.memberAddressModel.countDocuments(map, { content: 0 });
        pageData.list = await this.memberAddressModel.find(map, { content: 0 }).limit(page.pageSize).skip((page.pageIndex - 1) * page.pageSize).sort({ updateDate: -1 });
        return pageData;
    }

    async getDetailById(id: string): Promise<MemberAddress> {
        let map: any = { _id: new ObjectId(id) }
        return await this.memberAddressModel.findOne(map);
    }
    
    async getByIds(ids: string[]): Promise<MemberAddress[]> {
        const objectIds: ObjectId[] = [];
        ids.forEach(id => {
            objectIds.push(new ObjectId(id));
        });
        let map: any = { _id: { $in: objectIds } };
        return await this.memberAddressModel.find(map);
    }
   
    async getList(count?: number): Promise<MemberAddress[]> {
        let map:any = {};
        if(count){
            return await this.memberAddressModel.find(map).limit(count);
        }else{
            return await this.memberAddressModel.find(map);
        }
    }
}
