import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { FileUploadService } from './file-upload.service';
import { FileUpload } from './dto/file-upload.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { isImage, isOffice } from './dto/file-type.dto';
import { UUID } from 'src/utils/random-tools';

@ApiTags('文件管理')
@Controller('file')
export class FileUploadController {
    constructor(
        private fileUploadService: FileUploadService,
        private redisCacheService: RedisCacheService,
        private systemLogService: SystemLogService
    ) { };

    @Post('upload')
    @ApiOperation({ summary: 'uploadFile', description: '文件上传公开文件，无需登录' })
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: any, @Req() req: any): Promise<any> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            const fileInfo: FileUpload = await this.fileUploadService.create(file);
            rsp.success('上传成功', fileInfo);
            this.systemLogService.create('文件管理', `上传公开文件成功,${JSON.stringify(fileInfo)}`, req);
        } catch (e) {
            rsp.warring(e.toString());
            this.systemLogService.create('文件管理', `上传公开文件失败,${e.toString()}`, req);
        }
        return rsp;
    }

    @Post('uploadPrivate')
    @AuthTag('uploadPrivate')
    @ApiOperation({ summary: 'uploadFile', description: 'uploadPrivate:上传私有文件，仅登录后可以查看' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(200)
    async uploadPrivate(@UploadedFile() file, @Req() req: any): Promise<any> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            const fileInfo = await this.fileUploadService.create(file, true);
            rsp.success('上传成功', fileInfo);
            this.systemLogService.create('文件管理', `上传私有文件成功,${JSON.stringify(fileInfo)}`, req);
        } catch (e) {
            rsp.warring(e.toString());
            this.systemLogService.create('文件管理', `上传私有文件失败,${JSON.stringify(e.toString())}`, req);
        }
        return rsp;
    }

    @Get('private/:fileUUID')
    @AuthTag('getPrivateFile')
    @ApiOperation({ description: 'getPrivateFile:获取私有文件，需要登录以后才能使用' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPrivateFile(@Param('fileUUID') fileUUID: string, @Res() res: Response): Promise<any> {
        const { readStream, file } = await this.fileUploadService.getFileByUUID(fileUUID);
        res.contentType(
            file.contentType,
        );
        res.attachment(
            `${fileUUID}_${file.fileName}`,
        );
        readStream.pipe(res);
    }

    @Get('privateTemp/:viewUUID')
    @ApiOperation({ description: '获取临时开放私有文件' })
    async getPrivateFileTemp(@Param('viewUUID') viewUUID: string, @Res() res: Response, @Req() req: any): Promise<any> {
        const fileUUID = await this.redisCacheService.get(viewUUID);
        if (fileUUID) {
            const { readStream, file } = await this.fileUploadService.getFileByUUID(fileUUID);
            res.contentType(
                file.contentType,
            );
            res.attachment(
                `${fileUUID}_${file.fileName}`,
            );
            if (file.path.endsWith('pdf')) {
                res.setHeader('Content-Disposition', `inline; filename=${fileUUID}_${file.fileName}`)
            }
            readStream.pipe(res);
        } else {
            res.json(new ResponseInfoDto(req).error('链接已过期'));
            res.send();
        }
    }
    @Get('downPrivateTemp/:fileUUID')
    @AuthTag('downPrivateTemp')
    @ApiOperation({ description: 'downPrivateTemp:下载私有文件,office类型的数据生成临时开放数据,30分钟过期' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async downPrivateTemp(@Param("fileUUID") fileUUID: string, @Res() res: Response, @Req() req: any): Promise<any> {
        const viewUUID = UUID();
        const { readStream, file } = await this.fileUploadService.getFileByUUID(fileUUID);
        const fileType = file.path.split('.').pop();
        if (isOffice(fileType) || isImage(fileType)) {
            await this.redisCacheService.set(viewUUID, file.UUID, 30 * 60);
            res.json(new ResponseInfoDto(req).success('成功', { viewUUID, fileType, file }));
            res.send();
        } else {
            res.contentType(
                file.contentType,
            );
            res.attachment(
                `${file._id}_${file.fileName}`,
            );
            // btoa弃用，编码：Buffer.from(str, 'utf8').toString('base64'); 解码：Buffer.from(base64, 'base64').toString('utf8')
            res.setHeader('file-Name', Buffer.from(encodeURI(`${file._id}${file.fileName}`), 'utf8').toString('base64'));
            readStream.pipe(res);
        }
    }
    @Get('downPrivate/:fileUUID')
    @AuthTag('downPrivate')
    @ApiOperation({ description: 'downPrivate:下载私有文件' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async downPrivate(@Param("fileUUID") fileUUID: string, @Res() res: Response): Promise<any> {
        const { readStream, file } = await this.fileUploadService.getFileByUUID(fileUUID);
        res.contentType(
            file.contentType,
        );
        res.attachment(
            `${file._id}_${file.fileName}`,
        );
        // btoa弃用，编码：Buffer.from(str, 'utf8').toString('base64'); 解码：Buffer.from(base64, 'base64').toString('utf8')
        res.setHeader('file-Name', Buffer.from(encodeURI(`${file._id}${file.fileName}`), 'utf8').toString('base64'));
        readStream.pipe(res);
    }

    @Delete('delete/:id')
    @AuthTag('deleteFile')
    @ApiOperation({ description: 'deleteFile:删除文件' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.fileUploadService.delete(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('文件管理', `删除文件,${rsp.message},${id}`, req);
        return rsp;
    }
    @Get("getPage")
    @AuthTag('getFileManagementPage')
    @ApiOperation({ description: 'getFileManagementPage:获取文件管理分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() pageForm: PageRequestDto, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<FileUpload>>> {
        const info = new ResponseInfoDto<PageResponseDto<FileUpload>>(req);
        try {
            info.success(`成功`, await this.fileUploadService.getPage(pageForm));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
