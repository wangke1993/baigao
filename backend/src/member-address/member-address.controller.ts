import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { MemberAddressService } from './member-address.service';
import { MemberAddress } from './dto/member-address.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto';

@ApiTags('收货地址管理')
@Controller('memberAddress')
export class MemberAddressController {
    constructor(
        private memberAddressService: MemberAddressService,
        private systemLogService: SystemLogService
    ) { };

    @Post('create')
    @AuthTag('createMemberAddress')
    @ApiOperation({ description: 'createMemberAddress:创建收货地址管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: MemberAddress, @Req() req: any): Promise<ResponseInfoDto<MemberAddress>> {
        const rsp = new ResponseInfoDto<MemberAddress>(req);
        try {
            rsp.success('保存成功', await this.memberAddressService.create(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('收货地址管理', `创建收货地址管理,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('update/:id')
    @AuthTag('updateMemberAddress')
    @ApiOperation({ description: 'updateMemberAddress:编辑收货地址管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: MemberAddress, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<MemberAddress>> {
        const rsp = new ResponseInfoDto<MemberAddress>(req);
        try {
            rsp.success('更新成功', await this.memberAddressService.update(form, id, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('收货地址管理', `编辑收货地址管理,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
        return rsp;
    }

    @Delete('delete/:id')
    @AuthTag('deleteMemberAddressById')
    @ApiOperation({ description: 'deleteMemberAddress:删除收货地址管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.memberAddressService.deleteById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('收货地址管理', `删除收货地址管理,${rsp.message},${id}`, req);
        return rsp;
    }

    @Get('getDetail/:id')
    @AuthTag('getMemberAddressById')
    @ApiOperation({ description: 'getMemberAddressById:根据id获取收货地址管理详情' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getDetailById(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<MemberAddress>> {
        const rsp = new ResponseInfoDto<MemberAddress>(req);
        try {
            rsp.success('获取成功', await this.memberAddressService.getDetailById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }

    @Get("getPage")
    @AuthTag('getMemberAddressPage')
    @ApiOperation({ description: 'getMemberAddressPage:获取收货地址管理分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() page: PageRequestDto, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<MemberAddress>>> {
        const info = new ResponseInfoDto<PageResponseDto<MemberAddress>>(req);
        try {
            info.success(`成功`, await this.memberAddressService.getPage(page));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
