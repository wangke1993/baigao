import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { MemberMangerService } from './member-manger.service';
import { MemberManger } from './dto/member-manger.schema';
import { MemberPageForm } from './dto/member-manger-page-form.dto';
import { AddrManger } from './dto/addrs-manger.schema';
import { MemberDetailResponse } from './dto/member-response.dto';

@ApiTags('会员管理')
@Controller('member')
export class MemberMangerController {
    constructor(private memberMangerService: MemberMangerService, private systemLogService: SystemLogService) { };
    @Get("getMemberPage")
    @AuthTag('getMemberPage')
    @ApiOperation({ description: 'getMemberPage:获取会员分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getMemberPage(@Query() pageForm: MemberPageForm, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<MemberManger>>> {
        const info = new ResponseInfoDto<PageResponseDto<MemberManger>>();
        try {
            info.success(`成功`, await this.memberMangerService.getMemberPage(pageForm));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getMemberDetail/:memberUUID")
    @AuthTag('getMemberDetail')
    @ApiOperation({ description: 'getMemberDetail:获取会员详情' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getMemberDetail(@Param("memberUUID") memberUUID: string): Promise<ResponseInfoDto<MemberDetailResponse>> {
        const info = new ResponseInfoDto<MemberDetailResponse>();
        try {
            const memberDetailResponse = new MemberDetailResponse();
            memberDetailResponse.address = await this.memberMangerService.getMemberAddrList(memberUUID);
            info.success(`成功`, memberDetailResponse);
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getAddrListByAdmin/:memberUUID")
    @AuthTag('getAddrListByAdmin')
    @ApiOperation({ description: 'getAddrListByAdmin:管理员根据会员UUID获取会员地址信息列表' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getAddrListByAdmin(@Param("memberUUID") memberUUID: string): Promise<ResponseInfoDto<AddrManger[]>> {
        const info = new ResponseInfoDto<AddrManger[]>();
        try {
            info.success(`成功`, await this.memberMangerService.getMemberAddrList(memberUUID));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getAddrList")
    @AuthTag('getAddrList')
    @ApiOperation({ description: 'getAddrList:会员获取会员地址信息列表' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getAddrList(@Req() req: any): Promise<ResponseInfoDto<AddrManger[]>> {
        const info = new ResponseInfoDto<AddrManger[]>();
        try {
            info.success(`成功`, await this.memberMangerService.getMemberAddrList(req.user.UUID));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Post('createAddr')
    @AuthTag('createAddr')
    @ApiOperation({ description: 'createAddr:新增地址' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: AddrManger, @Req() req: any): Promise<ResponseInfoDto<AddrManger>> {
        const rsp = new ResponseInfoDto<AddrManger>();
        try {
            rsp.success('保存成功', await this.memberMangerService.addMemberAddr(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('会员管理', `新增会员地址,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('updateAddr/:id')
    @AuthTag('updateAddr')
    @ApiOperation({ description: 'updateAddr:编辑会员地址' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: AddrManger, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<AddrManger>> {
        const rsp = new ResponseInfoDto<AddrManger>();
        try {
            rsp.success('更新成功', await this.memberMangerService.editMemberAddr(id, form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('会员管理', `编辑会员地址,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
        return rsp;
    }
    @Delete('deleteAddr/:id')
    @AuthTag('deleteAddr')
    @ApiOperation({ description: 'deleteAddr:删除会员地址' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async deleteAddr(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>();
        try {
            rsp.success('删除成功', await this.memberMangerService.delMemberAddr(id, req.user.UUID));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('会员管理', `删除会员地址,${rsp.message},${id}`, req);
        return rsp;
    }
}
