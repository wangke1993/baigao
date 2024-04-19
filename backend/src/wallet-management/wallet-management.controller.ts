import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { WalletManagementService } from './wallet-management.service';
import { WalletManagement } from './dto/wallet-management.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { WalletLog } from './dto/wallet-log.schema';

@ApiTags('钱包管理')
@Controller('walletManagement')
export class WalletManagementController {
    constructor(
        private walletManagementService: WalletManagementService,
        private systemLogService: SystemLogService
    ) { };

    @Post('create')
    @AuthTag('createWalletManagement')
    @ApiOperation({ description: 'createWalletManagement:创建钱包管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: WalletManagement, @Req() req: any): Promise<ResponseInfoDto<WalletManagement>> {
        const rsp = new ResponseInfoDto<WalletManagement>(req);
        try {
            rsp.success('保存成功', await this.walletManagementService.create(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('钱包管理', `创建钱包管理,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('update/:id')
    @AuthTag('updateWalletManagement')
    @ApiOperation({ description: 'updateWalletManagement:编辑钱包管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: WalletManagement, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<WalletManagement>> {
        const rsp = new ResponseInfoDto<WalletManagement>(req);
        try {
            rsp.success('更新成功', await this.walletManagementService.update(form, id, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('钱包管理', `编辑钱包管理,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
        return rsp;
    }

    @Delete('delete/:id')
    @AuthTag('deleteWalletManagementById')
    @ApiOperation({ description: 'deleteWalletManagement:删除钱包管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.walletManagementService.deleteById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('钱包管理', `删除钱包管理,${rsp.message},${id}`, req);
        return rsp;
    }

    @Get('getDetail/:id')
    @AuthTag('getWalletManagementById')
    @ApiOperation({ description: 'getWalletManagementById:根据id获取钱包管理详情' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getDetailById(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<WalletManagement>> {
        const rsp = new ResponseInfoDto<WalletManagement>(req);
        try {
            rsp.success('获取成功', await this.walletManagementService.getDetailById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Get('getDetailByBindUserUUID/:bindUserUUID')
    @AuthTag('getDetailByBindUserUUID')
    @ApiOperation({ description: 'getDetailByBindUserUUID:根据BindUserUUID获取钱包管理详情' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getDetailByBindUserUUID(@Param("bindUserUUID") bindUserUUID: string, @Req() req: any): Promise<ResponseInfoDto<WalletManagement>> {
        const rsp = new ResponseInfoDto<WalletManagement>(req);
        try {
            rsp.success('获取成功', await this.walletManagementService.getDetailByBindUserUUID(bindUserUUID));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }

    @Get("getPage")
    @AuthTag('getWalletManagementPage')
    @ApiOperation({ description: 'getWalletManagementPage:获取钱包管理分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() page: PageRequestDto, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<WalletManagement>>> {
        const info = new ResponseInfoDto<PageResponseDto<WalletManagement>>(req);
        try {
            info.success(`成功`, await this.walletManagementService.getPage(page));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Post('changeInWalletAmount/:bindUserUUID')
    @AuthTag('changeInWalletAmount')
    @ApiOperation({ description: 'changeInWalletAmount:钱包金额变动' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async changeInAmount(@Body() form: WalletLog, @Param("bindUserUUID") bindUserUUID: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            if (form.logType == '-1') {
                rsp.success('扣款成功', await this.walletManagementService.expenditure(
                    bindUserUUID,
                    form.amount * 100,
                    form.remarks,
                    req
                ));
            } else if (form.logType == '1') {
                rsp.success('充值成功', await this.walletManagementService.income(
                    bindUserUUID,
                    form.amount * 100,
                    form.remarks,
                    req
                ));
            }
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('钱包管理', `金额变动,${rsp.message},${JSON.stringify(form)},${JSON.stringify({ bindUserUUID })}`, req);
        return rsp;
    }
    @Post('freezeThawWallet/:bindUserUUID')
    @AuthTag('freezeThawWallet')
    @ApiOperation({ description: 'freezeThawWallet:冻结解冻钱包' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async freezeThaw(@Param("bindUserUUID") bindUserUUID: string, @Req() req: any): Promise<ResponseInfoDto<WalletManagement>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('成功', await this.walletManagementService.freezeThaw(bindUserUUID, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('钱包管理', `冻结解冻,${rsp.message},${JSON.stringify({ bindUserUUID })}`, req);
        return rsp;
    }
}
