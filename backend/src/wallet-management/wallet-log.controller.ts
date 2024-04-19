import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { WalletLogService } from './wallet-log.service';
import { WalletLog } from './dto/wallet-log.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { WalletLogPageDto } from './dto/wallet-log-page.dto';
import { WalletLogDto } from './dto/wallet-log.dto';

@ApiTags('钱包流水')
@Controller('walletLog')
export class WalletLogController {
    constructor(
        private walletLogService: WalletLogService,
        private systemLogService: SystemLogService
    ) { };

    @Post('create')
    @AuthTag('createWalletLog')
    @ApiOperation({ description: 'createWalletLog:创建钱包流水' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: WalletLogDto, @Req() req: any): Promise<ResponseInfoDto<WalletLog>> {
        const rsp = new ResponseInfoDto<WalletLog>(req);
        try {
            rsp.success('保存成功', await this.walletLogService.create(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('钱包流水', `创建钱包流水,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('update/:id')
    @AuthTag('updateWalletLog')
    @ApiOperation({ description: 'updateWalletLog:编辑钱包流水' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: WalletLog, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<WalletLog>> {
        const rsp = new ResponseInfoDto<WalletLog>(req);
        try {
            rsp.success('更新成功', await this.walletLogService.update(form, id, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('钱包流水', `编辑钱包流水,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
        return rsp;
    }

    @Delete('delete/:id')
    @AuthTag('deleteWalletLogById')
    @ApiOperation({ description: 'deleteWalletLog:删除钱包流水' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.walletLogService.deleteById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('钱包流水', `删除钱包流水,${rsp.message},${id}`, req);
        return rsp;
    }

    @Get('getDetail/:id')
    @AuthTag('getWalletLogById')
    @ApiOperation({ description: 'getWalletLogById:根据id获取钱包流水详情' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getDetailById(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<WalletLog>> {
        const rsp = new ResponseInfoDto<WalletLog>(req);
        try {
            rsp.success('获取成功', await this.walletLogService.getDetailById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }

    @Get("getPage")
    @AuthTag('getWalletLogPage')
    @ApiOperation({ description: 'getWalletLogPage:获取钱包流水分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() page: WalletLogPageDto, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<WalletLog>>> {
        const info = new ResponseInfoDto<PageResponseDto<WalletLog>>(req);
        try {
            // TODO 如果是移动端发出的请求则只能获取自己的钱包明细
            info.success(`成功`, await this.walletLogService.getPage(page));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
