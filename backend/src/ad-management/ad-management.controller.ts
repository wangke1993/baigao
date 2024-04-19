import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { AdManagementService } from './ad-management.service';
import { AdManagement } from './dto/ad-management.schema';
import { AdPageForm } from './dto/ad-page-form';

@ApiTags('广告管理')
@Controller('rotation')
export class AdManagementController {
    constructor(private adManagementService: AdManagementService, private systemLogService: SystemLogService) { };
    @Post('create')
    @AuthTag('createAd')
    @ApiOperation({ description: 'createAd:创建广告' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: AdManagement, @Req() req: any): Promise<ResponseInfoDto<AdManagement>> {
        const rsp = new ResponseInfoDto<AdManagement>(req);
        try {
            rsp.success('保存成功', await this.adManagementService.create(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('广告管理', `创建广告,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('update/:id')
    @AuthTag('updateAd')
    @ApiOperation({ description: 'updateAd:编辑广告' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: AdManagement, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<AdManagement>> {
        const rsp = new ResponseInfoDto<AdManagement>(req);
        try {
            rsp.success('更新成功', await this.adManagementService.update(form, id, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('广告管理', `编辑广告,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
        return rsp;
    }
    @Delete('delete/:id')
    @AuthTag('deleteAd')
    @ApiOperation({ description: 'deleteAd:删除广告' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.adManagementService.deleteById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('广告管理', `删除广告,${rsp.message},${id}`, req);
        return rsp;
    }
    @Get("getPage")
    @AuthTag('getAdPage')
    @ApiOperation({ description: 'getAdPage:获取广告分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() pageForm: AdPageForm, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<AdManagement>>> {
        const info = new ResponseInfoDto<PageResponseDto<AdManagement>>(req);
        try {
            info.success(`成功`, await this.adManagementService.getPage(pageForm));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getList")
    // @AuthTag('getAdList')
    @ApiOperation({ description: '获取已发布的广告列表，无需登录' })
    // @UseGuards(JwtAuthGuard, PowerGuard)
    async getList(@Req() req: any): Promise<ResponseInfoDto<AdManagement[]>> {
        const info = new ResponseInfoDto<AdManagement[]>(req);
        try {
            info.success(`成功`, await this.adManagementService.getList());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
