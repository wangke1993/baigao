import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { FileUpload, FileUploadDocument, FileUploadModels } from './dto/file-upload.schema';
import { v4 as uuidV4 } from 'uuid';
import { createReadStream, ReadStream, existsSync } from 'fs';
import { SystemLog } from 'src/system-log/dto/system-log.schema';
import { deleteFile, getFileType, getFileUrl, saveFile, saveFileByBuffer, chargeFileNameCode } from './utils/file-tools';

@Injectable()
export class FileUploadService {
    private readonly logger = new Logger(FileUploadService.name);
    constructor(@InjectModel(FileUpload.name) private FileUploadModel: Model<FileUploadDocument>) { };
    async create(file: any, isPrivate: boolean = false): Promise<FileUpload> {
        const UUID = uuidV4();
        if (!file) {
            throw new Error("文件不能为空");
        }
        const path: any = await saveFile(file, UUID, isPrivate);
        const filename = chargeFileNameCode(file.originalname)
        let fileUpload = new FileUploadModels();
        fileUpload.size = file.size;
        fileUpload.fileName = filename;
        fileUpload.path = path;
        fileUpload.UUID = UUID;
        fileUpload.addDate = new Date();
        fileUpload.fileType = getFileType(filename);
        fileUpload.url = getFileUrl(filename, UUID, fileUpload.fileType, isPrivate);
        fileUpload.contentType = file.mimetype
        const create = new this.FileUploadModel(fileUpload);
        return create.save();
    }
    async createByBlob(fileName: any, arrayBuffer: ArrayBuffer, isPrivate: boolean = false): Promise<FileUpload> {
        const UUID = uuidV4();
        if (!arrayBuffer) {
            throw new Error("文件不能为空");
        }
        const buffer = Buffer.from(arrayBuffer)
        const filename = chargeFileNameCode(fileName)
        const path: any = await saveFileByBuffer(filename, buffer, UUID, isPrivate);
        let fileUpload = new FileUploadModels();
        fileUpload.size = buffer.byteLength / 1024;
        fileUpload.fileName = filename;
        fileUpload.path = path;
        fileUpload.UUID = UUID;
        fileUpload.addDate = new Date();
        fileUpload.fileType = getFileType(filename);
        fileUpload.url = getFileUrl(filename, UUID, fileUpload.fileType, isPrivate);
        const create = new this.FileUploadModel(fileUpload);
        return create.save();
    }
    async delete(UUID: string): Promise<any> {

        try {
            const file = await this.FileUploadModel.findOne({ UUID });
            if (file) {
                deleteFile(file.path);
                return this.FileUploadModel.deleteMany({ UUID });
            }
        } catch (err) {
            this.logger.log('文件删除异常', UUID, err.toString());
        }

    }
    async getFileByUUID(UUID: string): Promise<{ readStream: ReadStream, file: FileUpload }> {
        const file = await this.FileUploadModel.findOne({
            UUID: UUID
        });
        if (file && existsSync(file.path)) {
            return { readStream: createReadStream(file.path), file };
        } else {
            throw new Error(`找不到对应文件${file.path}`);
        }
    }
    async getPage(pageForm: PageRequestDto): Promise<PageResponseDto<FileUpload>> {
        const keyWord = pageForm?.keyWord ? pageForm?.keyWord : '';
        let map: any = {
            $or: [
                { fileName: { $regex: keyWord } }
            ]
        };
        const pageData = new PageResponseDto<FileUpload>();
        pageData.total = await this.FileUploadModel.countDocuments(map);
        pageData.list = await this.FileUploadModel.find(map).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize);
        return pageData;
    }
}
