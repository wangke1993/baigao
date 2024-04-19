import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { MemberManagementService } from './member-management.service';
import { MemberManagement } from './dto/member-management.schema';
import { MemberPageForm } from './dto/member-management-page-form.dto';
import { WalletManagement } from 'src/wallet-management/dto/wallet-management.schema';

@ApiTags('会员管理')
@Controller('member')
export class MemberManagementController {
    constructor(private memberManagementService: MemberManagementService, private systemLogService: SystemLogService) { };
    @Get("getPage")
    @AuthTag('getMemberPage')
    @ApiOperation({ description: 'getMemberPage:获取会员分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() pageForm: MemberPageForm, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<MemberManagement>>> {
        const info = new ResponseInfoDto<PageResponseDto<MemberManagement>>(req);
        try {
            info.success(`成功`, await this.memberManagementService.getMemberPage(pageForm));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Get("onlineStatistics")
    @AuthTag('onlineStatistics')
    @ApiOperation({ description: 'onlineStatistics:在线统计' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async onlineStatistics(@Req() req: any): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>(req);
        try {
            info.success(`成功`, await this.memberManagementService.onlineStatistics());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Get("getMemberList")
    @AuthTag('getMemberList')
    @ApiOperation({ description: 'getMemberList:获取会员列表' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getMemberList(@Req() req: any): Promise<ResponseInfoDto<MemberManagement[]>> {
        const info = new ResponseInfoDto<MemberManagement[]>(req);
        try {
            info.success(`成功`, await this.memberManagementService.getList());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Get("getMemberWallet")
    @AuthTag('getMemberWallet')
    @ApiOperation({ description: 'getMemberWallet:获取会员钱包明细' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getMemberWallet(@Req() req: any): Promise<ResponseInfoDto<WalletManagement>> {
        const info = new ResponseInfoDto<WalletManagement>(req);
        try {
            info.success(`成功`, await this.memberManagementService.getWalletDetail(req.user.UUID));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getMemberWalletByManger/:memberUUID")
    @AuthTag('getMemberWalletByManger')
    @ApiOperation({ description: 'getMemberWalletByManger:管理人员获取会员钱包明细' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getMemberWalletByManger(@Param('memberUUID') memberUUID: string, @Req() req: any): Promise<ResponseInfoDto<WalletManagement>> {
        const info = new ResponseInfoDto<WalletManagement>(req);
        try {
            // TODO 限制仅管理人员可以获取指定用户余额
            if (!memberUUID) {
                throw new Error("memberUUID不能为空");
            }
            info.success(`成功`, await this.memberManagementService.getWalletDetail(memberUUID));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Post('create')
    @AuthTag('createMemberManagement')
    @ApiOperation({ description: 'createMemberManagement:创建会员管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: MemberManagement, @Req() req: any): Promise<ResponseInfoDto<MemberManagement>> {
        const rsp = new ResponseInfoDto<MemberManagement>(req);
        try {
            rsp.success('保存成功', await this.memberManagementService.create(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('会员管理', `创建会员管理,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('update/:id')
    @AuthTag('updateMemberManagement')
    @ApiOperation({ description: 'updateMemberManagement:编辑会员管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: MemberManagement, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<MemberManagement>> {
        const rsp = new ResponseInfoDto<MemberManagement>(req);
        try {
            rsp.success('更新成功', await this.memberManagementService.update(form, id, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('会员管理', `编辑会员管理,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
        return rsp;
    }

    @Delete('delete/:id')
    @AuthTag('deleteMemberManagementById')
    @ApiOperation({ description: 'deleteMemberManagement:删除会员管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.memberManagementService.deleteById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('会员管理', `删除会员管理,${rsp.message},${id}`, req);
        return rsp;
    }

    @Get('getDetail/:id')
    @AuthTag('getMemberManagementById')
    @ApiOperation({ description: 'getMemberManagementById:根据id获取会员管理详情' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getDetailById(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<MemberManagement>> {
        const rsp = new ResponseInfoDto<MemberManagement>(req);
        try {
            rsp.success('获取成功', await this.memberManagementService.getDetailById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Get('getByUUID/:UUID')
    @AuthTag('getMemberManagementByUUID')
    @ApiOperation({ description: 'getMemberManagementByUUID:根据UUID获取会员管理详情' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getDetailByUUID(@Param("UUID") UUID: string, @Req() req: any): Promise<ResponseInfoDto<MemberManagement>> {
        const rsp = new ResponseInfoDto<MemberManagement>(req);
        try {
            rsp.success('获取成功', await this.memberManagementService.getDetailByUUID(UUID));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
}
