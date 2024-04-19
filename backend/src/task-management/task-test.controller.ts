import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { CreateTaskService } from './create-task.service';

@ApiTags('任务测试')
@Controller('taskTest')
export class TaskTestController {
    constructor(private createTaskService: CreateTaskService, private systemLogService: SystemLogService) { };
    @Get('test/:s')
    @AuthTag('taskTest')
    @ApiOperation({ description: '测试延时队列' })
    async Create(@Param('s') s: number, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('保存成功', await this.createTaskService.createTask({ data: '延时队列测试', tag: '1', message: '队列测试' }, Number(s)));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
}
