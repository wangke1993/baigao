import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { decode, encode } from 'utf8';
import { PageForm } from './dto/page-form';
import { SystemLogDto } from './dto/system-log.dto';
import { SystemLog, SystemLogDocument } from './dto/system-log.schema';

@Injectable()
export class SystemLogService {
    private readonly logger = new Logger(SystemLogService.name);
    /**
     * 1.创建日志
     * 2.日志分页:时间筛选、模糊搜索（模块名称/请求路径/操作内容/账号名称/）
     * this.systemLogService.create('系统日志',`获取分页:${JSON.stringify(pageForm)}`,req);
     */
    constructor(@InjectModel(SystemLog.name) private systemLogModel: Model<SystemLogDocument>) { }
    async create(modelName: String, content: String, req: any) {
        this.logger.log(`${req?.user?.userName} - ${modelName} - ${content}`);
        const systemLogDto = new SystemLogDto();
        systemLogDto.operationContent = content;
        systemLogDto.operationUserName = req?.user?.userName;
        systemLogDto.operationUserId = req?.user?._id;
        if (req?.user) {
            systemLogDto.operationUserInfo = JSON.stringify(req?.user);
        }
        systemLogDto.operationIp = req?.ip;
        if (req?.headers) {
            systemLogDto.systemInfo = req?.headers['sec-ch-ua-platform'];
            systemLogDto.clientInfo = req?.headers['user-agent'];
        }
        systemLogDto.requestUrl = req.url;
        systemLogDto.modelName = modelName;
        systemLogDto.comeFrom = req?.headers?.referer;
        systemLogDto.operationTime = new Date();
        const create = new this.systemLogModel(systemLogDto);
        return create.save();
    }
    async removeAll(): Promise<any> {
        return this.systemLogModel.remove({});
    }
    async getPage(pageForm: PageForm): Promise<PageResponseDto<SystemLogDto>> {
        const keyWord = pageForm?.keyWord ? pageForm?.keyWord : '';
        let map = {
            $or: [
                { modelName: { $regex: keyWord } },
                { requestUrl: { $regex: keyWord } },
                { operationContent: { $regex: keyWord } },
                { operationUserName: { $regex: keyWord } },
            ]
        };
        if (pageForm?.startTime && pageForm?.endTime) {
            map['operationTime'] = { $gte: pageForm.startTime, $lte: pageForm.endTime };
        }
        if (pageForm?.IP) {
            map['operationIp'] = pageForm.IP;
        }
        const pageData = new PageResponseDto<SystemLogDto>();
        pageData.total = await this.systemLogModel.countDocuments(map);
        pageData.list = await this.systemLogModel.find(map).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize).sort({ operationTime: -1 });
        return pageData;
    }
}
