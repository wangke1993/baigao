import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { WithdrawalManagementService } from './withdrawal-management.service';
import { WithdrawalManagement } from './dto/withdrawal-management.schema';
import { WithdrawalManagementPageDto } from './dto/withdrawal-management-page.dto';
import { WithdrawalRefuseDto } from './dto/withdrawal-refuse.dto';
import { WalletManagementService } from 'src/wallet-management/wallet-management.service';


@ApiTags('提现管理')
@Controller('withdrawalManagement')
export class WithdrawalManagementController {
    constructor(
        private withdrawalManagementService: WithdrawalManagementService,
        private systemLogService: SystemLogService,
        private walletManagementService: WalletManagementService,
    ) { };

    // @Post('create')
    // @AuthTag('createWithdrawalManagement')
    // @ApiOperation({ description: 'createWithdrawalManagement:创建提现管理' })
    // @UseGuards(JwtAuthGuard, PowerGuard)
    // async create(@Body() form: WithdrawalManagement, @Req() req: any): Promise<ResponseInfoDto<WithdrawalManagement>> {
    //     const rsp = new ResponseInfoDto<WithdrawalManagement>(req);
    //     try {
    //         rsp.success('保存成功', await this.withdrawalManagementService.create(form, req));
    //     } catch (e) {
    //         rsp.warring(e.toString());
    //     }
    //     this.systemLogService.create('提现管理', `创建提现管理,${rsp.message},${JSON.stringify(form)}`, req);
    //     return rsp;
    // }

    // @Post('update/:id')
    // @AuthTag('updateWithdrawalManagement')
    // @ApiOperation({ description: 'updateWithdrawalManagement:编辑提现管理' })
    // @UseGuards(JwtAuthGuard, PowerGuard)
    // async update(@Body() form: WithdrawalManagement, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<WithdrawalManagement>> {
    //     const rsp = new ResponseInfoDto<WithdrawalManagement>(req);
    //     try {
    //         rsp.success('更新成功', await this.withdrawalManagementService.update(form, id, req));
    //     } catch (e) {
    //         rsp.warring(e.toString());
    //     }
    //     this.systemLogService.create('提现管理', `编辑提现管理,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
    //     return rsp;
    // }

    @Delete('delete/:id')
    @AuthTag('deleteWithdrawalManagementById')
    @ApiOperation({ description: 'deleteWithdrawalManagement:删除提现管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.withdrawalManagementService.deleteById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('提现管理', `删除提现管理,${rsp.message},${id}`, req);
        return rsp;
    }

    @Get('getDetail/:id')
    @AuthTag('getWithdrawalManagementById')
    @ApiOperation({ description: 'getWithdrawalManagementById:根据id获取提现管理详情' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getDetailById(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<WithdrawalManagement>> {
        const rsp = new ResponseInfoDto<WithdrawalManagement>(req);
        try {
            rsp.success('获取成功', await this.withdrawalManagementService.getDetailById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }

    @Get("getPage")
    @AuthTag('getWithdrawalManagementPage')
    @ApiOperation({ description: 'getWithdrawalManagementPage:获取提现管理分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() page: WithdrawalManagementPageDto, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<WithdrawalManagement>>> {
        const info = new ResponseInfoDto<PageResponseDto<WithdrawalManagement>>(req);
        try {
            info.success(`成功`, await this.withdrawalManagementService.getPage(page));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getPageByWeChat")
    @AuthTag('getWithdrawalManagementPageByWeChat')
    @ApiOperation({ description: 'getWithdrawalManagementPageByWeChat:微信小程序获取提现管理分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPageByWeChat(@Query() page: WithdrawalManagementPageDto, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<WithdrawalManagement>>> {
        const info = new ResponseInfoDto<PageResponseDto<WithdrawalManagement>>(req);
        try {
            // TODO根据自己实际情况进行分页
            info.success(`成功`, await this.withdrawalManagementService.getPage(page));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Post('application/:userPort/:money')
    @AuthTag('walletWithdrawalApplication')
    @ApiOperation({ description: 'walletWithdrawalApplication:钱包提现申请' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async walletWithdrawalApplication(
        @Param('userPort') userPort: string,
        @Param('money') money: number,
        @Req() req: any
    ): Promise<ResponseInfoDto<WithdrawalManagement>> {
        const rsp = new ResponseInfoDto<WithdrawalManagement>(req);
        try {
            rsp.success('保存成功', await this.withdrawalManagementService.withdrawalApplication(userPort, Number(money), req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('提现管理', `提现申请,${rsp.message}${JSON.stringify({ userPort, money })}`, req);
        return rsp;
    }
    @Post('approved/:id')
    @AuthTag('withdrawalApplicationApproved')
    @ApiOperation({ description: 'withdrawalApplicationApproved:钱包提现申请通过' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async approved(@Param('id') id: string, @Req() req: any): Promise<ResponseInfoDto<WithdrawalManagement>> {
        const rsp = new ResponseInfoDto<WithdrawalManagement>(req);
        try {
            rsp.success('保存成功', await this.withdrawalManagementService.applicationApproved(id, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('提现管理', `同意提现,${id},${rsp.message}`, req);
        return rsp;
    }
    @Post('refuse')
    @AuthTag('walletWithdrawalApplicationRefuse')
    @ApiOperation({ description: 'walletWithdrawalApplicationRefuse:拒绝钱包提现申请' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async refuse(@Body() withdrawalRefuseDto: WithdrawalRefuseDto, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('保存成功', await this.withdrawalManagementService.refusalOfApplication(withdrawalRefuseDto.id, withdrawalRefuseDto.reason, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('提现管理', `拒绝申请,${rsp.message}${JSON.stringify({ withdrawalRefuseDto })}`, req);
        return rsp;
    }
}
