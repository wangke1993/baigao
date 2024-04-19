import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { TreeClassificationService } from './tree-classification.service';
import { TreeClassification } from './dto/tree-classification.schema';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { TreeClassificationDto } from './dto/tree-classification.dto';

@ApiTags('树形分类管理')
@Controller('treeClassification')
export class TreeClassificationController {
    constructor(private TreeClassificationService: TreeClassificationService, private systemLogService: SystemLogService) { };
    @Post('Create')
    @AuthTag('createTreeClassification')
    @ApiOperation({ description: 'createTreeClassification:新增树形分类' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async Create(@Body() form: TreeClassification, @Req() req: any): Promise<ResponseInfoDto<TreeClassification>> {
        const rsp = new ResponseInfoDto<TreeClassification>(req);
        try {
            rsp.success('保存成功', await this.TreeClassificationService.create(form));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('树形分类管理', `新增树形分类管理,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('Update/:id')
    @AuthTag('updateTreeClassification')
    @ApiOperation({ description: 'updateTreeClassification：编辑树形分类管理' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async Update(@Body() form: TreeClassification, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<TreeClassification>> {
        const rsp = new ResponseInfoDto<TreeClassification>(req);
        try {
            rsp.success('更新成功', await this.TreeClassificationService.update(form, id, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('树形分类管理', `修树形分类管理,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
        return rsp;
    }
    @Delete('Delete/:id')
    @AuthTag('deleteTreeClassification')
    @ApiOperation({ description: 'deleteTreeClassification:删除树形分类' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async Delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.TreeClassificationService.deleteById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('树形分类管理', `删除据树形分类,${rsp.message},${id}`, req);
        return rsp;
    }
    @Get("getTree/:dataClass")
    @AuthTag('getTreeClassificationTree')
    @ApiOperation({ description: 'getTreeClassificationTree:获取树形分类管理树' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getTree(@Param("dataClass") dataClass: String, @Query("keyWord") keyWord: String, @Req() req: any): Promise<ResponseInfoDto<TreeClassificationDto[]>> {
        const info = new ResponseInfoDto<TreeClassificationDto[]>(req);
        try {
            info.success(`成功`, await this.TreeClassificationService.getTree(dataClass, keyWord));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getOpenTree/:dataClass")
    @ApiOperation({ description: '获取开放的树形分类管理树' })
    @UseGuards(JwtAuthGuard)
    async getOpenTree(@Param("dataClass") dataClass: String, @Query("keyWord") keyWord: String, @Req() req: any): Promise<ResponseInfoDto<TreeClassificationDto[]>> {
        const info = new ResponseInfoDto<TreeClassificationDto[]>(req);
        try {
            info.success(`成功`, await this.TreeClassificationService.getTree(dataClass, keyWord, true));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    /**
     * 上下移动
     * 上移，sort-1 上移到1不再上移
     * 下移，sort+1 下移到breathCount不再下移
     * 
     */
    @Post('move/:direction')
    @AuthTag('moveTreeClassification')
    @ApiOperation({ description: 'moveTreeClassification:移动树形;direction==1上移,direction==-1下移' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async move(@Body() form: TreeClassification, @Param("direction") direction: Number, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('移动成功', await this.TreeClassificationService.move(form, direction, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('树形分类管理', `移动树形分类管理,${rsp.message},${JSON.stringify(form)},direction:${direction}`, req);
        return rsp;
    }
    @Post('getLastList/:dataClass')
    @AuthTag('getTreeLastList')
    @ApiOperation({ description: 'getTreeLastList:获取末级分类' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getLastList(@Param("dataClass") dataClass: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('获取成功', await this.TreeClassificationService.getLastList(dataClass));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Post('getFirstList/:dataClass')
    @AuthTag('getTreeFirstList')
    @ApiOperation({ description: 'getTreeFirstList:获取一级分类' })
    // @UseGuards(JwtAuthGuard, PowerGuard)
    async getFirstList(@Param("dataClass") dataClass: string, @Req() req: any): Promise<ResponseInfoDto<TreeClassification[]>> {
        const rsp = new ResponseInfoDto<TreeClassification[]>(req);
        try {
            rsp.success('获取成功', await this.TreeClassificationService.getFirstList(dataClass));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
}
