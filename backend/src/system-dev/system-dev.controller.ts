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
import { CreateCodeConfDto } from './dto/create-code-conf.dto';
import { translateZhToEn } from './fanyi';

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
        const rsp = new ResponseInfoDto<ModuleConf>(req);
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
        const rsp = new ResponseInfoDto<ModuleField>(req);
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
        const rsp = new ResponseInfoDto<ModuleSearch>(req);
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
        const rsp = new ResponseInfoDto<ModuleConf>(req);
        try {
            rsp.success('更新成功', await this.systemDev.updateConf(form, UUID, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Post('DevUpdateModuleField/:UUID')
    @ApiOperation({ description: '更新模型字段' })
    @UseGuards(JwtAuthGuard)
    async DevUpdateModuleField(@Body() form: ModuleField, @Param("UUID") UUID: string, @Req() req: any): Promise<ResponseInfoDto<ModuleField>> {
        const rsp = new ResponseInfoDto<ModuleField>(req);
        try {
            rsp.success('更新成功', await this.systemDev.updateField(form, UUID, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Post('DevUpdateModuleSearch/:id')
    @ApiOperation({ description: '更新模型搜索配置' })
    @UseGuards(JwtAuthGuard)
    async DevUpdateModuleSearch(@Body() form: ModuleSearch, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<ModuleSearch>> {
        const rsp = new ResponseInfoDto<ModuleSearch>(req);
        try {
            rsp.success('保存成功', await this.systemDev.updateSearch(form, id, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Delete('DeleteModule/:id')
    @ApiOperation({ description: '删除模型' })
    @UseGuards(JwtAuthGuard)
    async DeleteModule(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
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
    async DeleteModuleField(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
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
    async DeleteModuleSearch(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.systemDev.deleteSearchById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Get('getModuleList')
    @AuthTag('getModuleList')
    @ApiOperation({ description: '获取模型列表' })
    @UseGuards(JwtAuthGuard)
    async getModuleList(@Query('keyWord') keyWord: String, @Req() req: any): Promise<ResponseInfoDto<ModuleConf[]>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('获取成功', await this.systemDev.getModuleList(keyWord));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Get('getModuleFieldList/:moduleUUID')
    @ApiOperation({ description: '获取模型字段列表' })
    @UseGuards(JwtAuthGuard)
    async getModuleFieldList(@Query('keyWord') keyWord: String, @Param("moduleUUID") moduleUUID: String, @Req() req: any): Promise<ResponseInfoDto<ModuleConf[]>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('获取成功', await this.systemDev.getModuleFieldList(moduleUUID, keyWord));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Get('getModuleSearchList/:moduleUUID')
    @ApiOperation({ description: '获取模型搜索列表' })
    @UseGuards(JwtAuthGuard)
    async getModuleSearchList(@Param("moduleUUID") moduleUUID: String, @Req() req: any): Promise<ResponseInfoDto<ModuleConf[]>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('获取成功', await this.systemDev.getModuleSearchList(moduleUUID));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }

    @Post('createCode/:UUID')
    @ApiOperation({ description: '生成代码' })
    @UseGuards(JwtAuthGuard)
    async createCode(@Param('UUID') UUID: String, @Body() conf: CreateCodeConfDto, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>(req);
        try {
            info.success("成功", await this.systemDev.createCode(UUID, conf));
        } catch (e) {
            info.error(e.toString());
        }
        return info;
    }
    @Post('createMenu/:UUID')
    @ApiOperation({ description: '挂载菜单' })
    @UseGuards(JwtAuthGuard)
    async createMenu(@Param('UUID') UUID: String, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>(req);
        try {
            info.success("成功", await this.systemDev.createMenu(UUID));
        } catch (e) {
            info.error(e.toString());
        }
        return info;
    }
    @Get('translateZhToEn')
    @ApiOperation({ description: '中文翻译成英文' })
    @UseGuards(JwtAuthGuard)
    async translateZhToEn(@Query('keyWord') keyWord: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>(req);
        try {
            info.success("成功", await translateZhToEn(keyWord));
        } catch (e) {
            info.error(e.toString());
        }
        return info;
    }
}
