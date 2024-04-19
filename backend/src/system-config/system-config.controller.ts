import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { SystemConfigService } from './system-config.service';
import { SystemConfig } from './dto/system-config.schema';
import { SystemConfigPage } from './dto/system-config-page.dto';

@ApiTags('业务参数配置')
@Controller('systemConfig')
export class SystemConfigController {
    constructor(private systemConfigService: SystemConfigService, private systemLogService: SystemLogService) { };
    @Post('create')
    @AuthTag('createBindSystemConfig')
    @ApiOperation({ description: 'createBindSystemConfig:创建业务参数配置绑定' })
    async create(@Body() form: SystemConfig, @Req() req: any): Promise<ResponseInfoDto<SystemConfig>> {
        const rsp = new ResponseInfoDto<SystemConfig>(req);
        try {
            rsp.success('保存成功', await this.systemConfigService.create(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('业务参数配置', `创建业务参数配置,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('update/:confSelect')
    @AuthTag('updateSystemConfig')
    @ApiOperation({ description: 'updateSystemConfig:编辑业务参数配置绑定,data只传confValue即可' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: SystemConfig, @Param("confSelect") confSelect: string, @Req() req: any): Promise<ResponseInfoDto<SystemConfig>> {
        const rsp = new ResponseInfoDto<SystemConfig>(req);
        try {
            rsp.success('更新成功', await this.systemConfigService.update(form, confSelect, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('业务参数配置', `编辑业务参数配置绑定,${rsp.message},${JSON.stringify(form)},confSelect:${confSelect}`, req);
        return rsp;
    }
    @Delete('delete/:confSelect')
    @AuthTag('deleteSystemConfig')
    @ApiOperation({ description: 'deleteSystemConfig:删除业务参数配置绑定' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("confSelect") confSelect: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.systemConfigService.deleteByConfSelect(confSelect));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('业务参数配置', `删除业务参数配置绑定,${rsp.message},${confSelect}`, req);
        return rsp;
    }
    @Get("getAll")
    @AuthTag('getAllSystemConfig')
    @ApiOperation({ description: 'getAllSystemConfig:获取所有配置信息' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getAll(@Req() req: any): Promise<ResponseInfoDto<SystemConfig[]>> {
        const info = new ResponseInfoDto<SystemConfig[]>(req);
        try {
            info.success(`成功`, await this.systemConfigService.getAll());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getOpenAll")
    @ApiOperation({ description: '获取所有对外开放的配置信息' })
    async getOpenAll(@Req() req: any): Promise<ResponseInfoDto<SystemConfig[]>> {
        const info = new ResponseInfoDto<SystemConfig[]>(req);
        try {
            info.success(`成功`, await this.systemConfigService.getAll(true));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getSystemConfigDetail/:code")
    @ApiOperation({ description: 'getSystemConfigDetail: 根据字典code获取系统配置详情,多个code用逗号隔开' })
    @AuthTag('getSystemConfigDetail')
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getSystemConfigDetail(@Param('code') code: string, @Req() req: any): Promise<ResponseInfoDto<SystemConfig[]>> {
        const info = new ResponseInfoDto<SystemConfig[]>(req);
        try {
            info.success(`成功`, await this.systemConfigService.getDetailByCode(code.split(',')));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getSystemPageConfig")
    @AuthTag('getSystemPageConfig')
    @ApiOperation({ description: 'getSystemPageConfig:获取【参数配置】页面配置信息' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getSystemPageConfig(@Req() req: any): Promise<ResponseInfoDto<String>> {
        const info = new ResponseInfoDto<String>(req);
        try {
            info.success(`成功`, await this.systemConfigService.getSystemPageConfig());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Post("updateSystemPageConfig")
    @AuthTag('updateSystemPageConfig')
    @ApiOperation({ description: 'updateSystemPageConfig:更新【参数配置】页面配置信息' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async updateSystemPageConfig(@Body() form: SystemConfig, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>(req);
        try {
            info.success(`成功`, await this.systemConfigService.updateSystemPageConfig(form.confValue));
            this.systemLogService.create('业务参数配置-成功', `(更新【参数配置】页面配置信息):${JSON.stringify(form.confValue)}`, req);
        } catch (e) {
            info.warring(e.toString());
            this.systemLogService.create('业务参数配置-失败', `(更新【参数配置】页面配置信息)信息：${e.toString},值：${JSON.stringify(form.confValue)}`, req);
        }
        return info;
    }
}
