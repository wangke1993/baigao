import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { AdMangerService } from './ad-manger.service';
import { AdManger } from './dto/ad-manger.schema';
import { AdPageForm } from './dto/ad-page-form';

@ApiTags('广告管理')
@Controller('rotation')
export class AdMangerController {
    constructor(private adMangerService: AdMangerService, private systemLogService: SystemLogService) { };
    @Post('create')
    @AuthTag('createAd')
    @ApiOperation({ description: 'createAd:创建广告' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: AdManger, @Req() req: any): Promise<ResponseInfoDto<AdManger>> {
        const rsp = new ResponseInfoDto<AdManger>();
        try {
            rsp.success('保存成功', await this.adMangerService.create(form, req));
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
    async update(@Body() form: AdManger, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<AdManger>> {
        const rsp = new ResponseInfoDto<AdManger>();
        try {
            rsp.success('更新成功', await this.adMangerService.update(form, id, req));
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
        const rsp = new ResponseInfoDto<any>();
        try {
            rsp.success('删除成功', await this.adMangerService.deleteById(id));
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
    async getPage(@Query() pageForm: AdPageForm, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<AdManger>>> {
        const info = new ResponseInfoDto<PageResponseDto<AdManger>>();
        try {
            info.success(`成功`, await this.adMangerService.getPage(pageForm));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getList")
    // @AuthTag('getAdList')
    @ApiOperation({ description: '获取已发布的广告列表，无需登录' })
    // @UseGuards(JwtAuthGuard, PowerGuard)
    async getList(): Promise<ResponseInfoDto<AdManger[]>> {
        const info = new ResponseInfoDto<AdManger[]>();
        try {
            info.success(`成功`, await this.adMangerService.getList());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
