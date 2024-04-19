import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { WalletLog, WalletLogDocument } from './dto/wallet-log.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { WalletLogPageDto } from './dto/wallet-log-page.dto';
import { WalletLogDto } from './dto/wallet-log.dto';
@Injectable()
export class WalletLogService {
    private readonly logger = new Logger(WalletLogService.name);
    constructor(
        @InjectModel(WalletLog.name) private walletLogModel: Model<WalletLogDocument>,
        private fileUploadService: FileUploadService,
        private transactionHelper: TransactionHelper
    ) { };

    async create(data: WalletLogDto, req: any): Promise<WalletLog> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        data.addUser = req?.user?.userName;
        data.addDate = new Date();

        return new this.walletLogModel(data).save();
    }

    async deleteById(id: string): Promise<any> {
        const data = await this.walletLogModel.findOne({ _id: new ObjectId(id) });
        this.logger.warn("删除数据", data);
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
        return this.walletLogModel.deleteOne({ _id: new ObjectId(id) });
    }

    async update(data: WalletLog, id: string, req: any): Promise<any> {
        data.updateUser = req?.user?.userName;
        data.updateDate = new Date();
        delete data.addDate;
        delete data.addUser;
        return await this.walletLogModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...data } });
    }


    async getPage(page: WalletLogPageDto): Promise<PageResponseDto<WalletLog>> {
        const keyWord = page?.keyWord ? page?.keyWord : '';
        const map: any = {
            $or: [
                { remarks: { $regex: keyWord } },
            ],
            takeEffect: { $ne: false }
        };
        if (page.walletUUID) {
            map.walletUUID = page.walletUUID;
        }
        if (page.logType) {
            map.logType = page.logType;
        }
        const pageData = new PageResponseDto<WalletLog>();
        pageData.total = await this.walletLogModel.countDocuments(map, { content: 0 });
        pageData.list = await this.walletLogModel.find(map, { content: 0 }).limit(page.pageSize).skip((page.pageIndex - 1) * page.pageSize).sort({ addDate: -1 });
        return pageData;
    }

    async getDetailById(id: string): Promise<WalletLog> {
        let map: any = { _id: new ObjectId(id) }
        return await this.walletLogModel.findOne(map);
    }

    async getByIds(ids: string[]): Promise<WalletLog[]> {
        const objectIds: ObjectId[] = [];
        ids.forEach(id => {
            objectIds.push(new ObjectId(id));
        });
        let map: any = { _id: { $in: objectIds } };
        return await this.walletLogModel.find(map);
    }

    async getList(count?: number): Promise<WalletLog[]> {
        let map: any = {};
        if (count) {
            return await this.walletLogModel.find(map).limit(count);
        } else {
            return await this.walletLogModel.find(map);
        }
    }
}
