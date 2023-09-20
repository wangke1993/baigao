import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { existsSync, mkdir, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { deleteFolderRecursive } from 'src/file-upload/utils/file-tools';
import { SystemDevService } from './system-dev.service';
import { ModuleConf } from './dto/module-conf.schema';
import { ModuleField } from './dto/module-field.schema';
import { ModuleSearch } from './dto/module-search.schema';

@ApiTags("开发工具")
@Controller('/systemDev')
export class SystemDevController {

    constructor(
        private systemDev: SystemDevService
    ) { };

    @Post('DevCreateModule')
    @ApiOperation({ description: 'DevCreateModule:新增模型' })
    @UseGuards(JwtAuthGuard)
    async CreateModule(@Body() form: ModuleConf, @Req() req: any): Promise<ResponseInfoDto<ModuleConf>> {
        const rsp = new ResponseInfoDto<ModuleConf>();
        try {
            rsp.success('保存成功', await this.systemDev.createConf(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Post('DevCreateModuleField')
    @ApiOperation({ description: 'DevCreateModuleField:新增模型字段' })
    @UseGuards(JwtAuthGuard)
    async CreateModuleField(@Body() form: ModuleField, @Req() req: any): Promise<ResponseInfoDto<ModuleField>> {
        const rsp = new ResponseInfoDto<ModuleField>();
        try {
            rsp.success('保存成功', await this.systemDev.createField(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Post('DevCreateModuleSearch')
    @ApiOperation({ description: '新增模型搜索配置' })
    @UseGuards(JwtAuthGuard)
    async CreateModuleSearch(@Body() form: ModuleSearch, @Req() req: any): Promise<ResponseInfoDto<ModuleSearch>> {
        const rsp = new ResponseInfoDto<ModuleSearch>();
        try {
            rsp.success('保存成功', await this.systemDev.createSearch(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }

    @Post('DevUpdateModule/:UUID')
    @ApiOperation({ description: 'DevUpdateModule:更新模型' })
    @UseGuards(JwtAuthGuard)
    async DevUpdateModule(@Body() form: ModuleConf, @Param("UUID") UUID: string, @Req() req: any): Promise<ResponseInfoDto<ModuleConf>> {
        const rsp = new ResponseInfoDto<ModuleConf>();
        try {
            rsp.success('更新成功', await this.systemDev.updateConf(form, UUID, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Post('DevUpdateModuleField/:UUID')
    @ApiOperation({ description: 'DevUpdateModuleField:更新模型字段' })
    @UseGuards(JwtAuthGuard)
    async DevUpdateModuleField(@Body() form: ModuleField, @Param("UUID") UUID: string, @Req() req: any): Promise<ResponseInfoDto<ModuleField>> {
        const rsp = new ResponseInfoDto<ModuleField>();
        try {
            rsp.success('更新成功', await this.systemDev.updateField(form, UUID, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Post('DevUpdateModuleSearch/:UUID')
    @ApiOperation({ description: '新增模型搜索配置' })
    @UseGuards(JwtAuthGuard)
    async DevUpdateModuleSearch(@Body() form: ModuleSearch, @Param("UUID") UUID: string, @Req() req: any): Promise<ResponseInfoDto<ModuleSearch>> {
        const rsp = new ResponseInfoDto<ModuleSearch>();
        try {
            rsp.success('保存成功', await this.systemDev.updateSearch(form, UUID, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Delete('DeleteModule/:id')
    @ApiOperation({ description: '删除模型' })
    @UseGuards(JwtAuthGuard)
    async DeleteModule(@Param("id") id: string): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>();
        try {
            rsp.success('删除成功', await this.systemDev.deleteConfById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Delete('DeleteModuleField/:id')
    @ApiOperation({ description: '删除模型字段' })
    @UseGuards(JwtAuthGuard)
    async DeleteModuleField(@Param("id") id: string): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>();
        try {
            rsp.success('删除成功', await this.systemDev.deleteFieldById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Delete('DeleteModuleSearch/:id')
    @ApiOperation({ description: '删除模型搜索配置' })
    @UseGuards(JwtAuthGuard)
    async DeleteModuleSearch(@Param("id") id: string): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>();
        try {
            rsp.success('删除成功', await this.systemDev.deleteSearchById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }


    @Get('createCode')
    @AuthTag('createCode')
    @ApiOperation({ description: '生成代码' })
    async getPath(): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>();
        try {
            const pathConf = {
                backend: __dirname.replace('dist\\system-dev', 'src'),
                frontend: __dirname.replace('backend', 'frontend').replace('dist\\system-dev', 'src'),
                temp: __dirname.replace('dist\\system-dev', 'dist\\temp'),
            }
            mkdirSync(pathConf.temp);
            // 判断src存在即为开发环境，否则为生产环境

            // 创建文件夹
            // const moduleName = "company-manger";
            // const backendPath = `${pathConf.backend}/${moduleName}`;
            // if (!existsSync(backendPath)) {
            //     mkdirSync(backendPath);
            // }

            // 创建文件
            // if (existsSync(backendPath)) {
            //     const dtoFileList = ['company-manger.dto.ts'];
            //     const fileList = [
            //         'company-manger.controller.ts',
            //         'company-manger.module.ts',
            //         'company-manger.service.ts',
            //     ]
            //     if (!existsSync(`${backendPath}/dto`)) {
            //         mkdirSync(`${backendPath}/dto`);
            //     }
            //     dtoFileList.map(path => {
            //         writeFileSync(`${backendPath}/dto/${path}`, "//dto");
            //     });
            //     fileList.map(path => {
            //         writeFileSync(`${backendPath}/${path}`, "//业务文件");
            //     })
            // }

            // 删除文件夹
            // deleteFolderRecursive(`${pathConf.backend}/company-manger`);
            info.success(`成功`, pathConf);
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
