import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { PageForm } from './dto/page-form';
import { SystemLogDto } from './dto/system-log.dto';
import { SystemLogService } from './system-log.service';

@ApiTags("系统日志")
@Controller('/admin/SystemLog')
export class SystemLogController {

    constructor(private systemLogService: SystemLogService) { };
    @Get('getPage')
    @AuthTag('getSystemLogPage')
    @ApiOperation({ description: 'getSystemLogPage:获取系统日志分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() pageForm: PageForm, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<SystemLogDto>>> {
        const info = new ResponseInfoDto<PageResponseDto<SystemLogDto>>();
        try {
            info.success(`成功`, await this.systemLogService.getPage(pageForm));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
