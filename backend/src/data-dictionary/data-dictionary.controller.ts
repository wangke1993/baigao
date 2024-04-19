import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { DataDictionaryService } from './data-dictionary.service';
import { DataDictionary, DIC_TYPE } from './dto/data-dictionary.schema';
import { DicPageForm } from './dto/dic-page-form';
import { DicTree } from './dto/dic-tree.dto';

@ApiTags('数据字典')
@Controller('admin/dic')
export class DataDictionaryController {
    constructor(private dataDictionaryService: DataDictionaryService, private systemLogService: SystemLogService) { };
    @Post('create')
    @AuthTag('createDic')
    @ApiOperation({ description: 'createDic:新增字典,dicType等于1时添加分类等于2时添加字典值' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: DataDictionary, @Req() req: any): Promise<ResponseInfoDto<DataDictionary>> {
        const rsp = new ResponseInfoDto<DataDictionary>(req);
        try {
            rsp.success('保存成功', await this.dataDictionaryService.create(form));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('数据字典', `新增数据字典,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('update/:id')
    @AuthTag('updateDic')
    @ApiOperation({ description: 'updateDic：编辑数据字典' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: DataDictionary, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<DataDictionary>> {
        const rsp = new ResponseInfoDto<DataDictionary>(req);
        try {
            rsp.success('更新成功', await this.dataDictionaryService.update(form, id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('数据字典', `修数据字典,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
        return rsp;
    }

    @Get('getList/:dicClass')
    // @AuthTag('getListByDicClass')
    @ApiOperation({ description: '根据字典分类(分类dicCode)获取字典值,无需权限校验' })
    // @UseGuards(JwtAuthGuard, PowerGuard)
    async getListByDicClass(@Param("dicClass") dicClass: string, @Req() req: any): Promise<ResponseInfoDto<DataDictionary[]>> {
        const rsp = new ResponseInfoDto<DataDictionary[]>(req);
        try {
            rsp.success('获取成功', await this.dataDictionaryService.getListByDicClass(dicClass));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Delete('delete/:dicCode')
    @AuthTag('deleteDic')
    @ApiOperation({ description: 'deleteDic:删除字典' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("dicCode") dicCode: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.dataDictionaryService.deleteByCode(dicCode));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('数据字典', `删除据字典,${rsp.message},${dicCode}`, req);
        return rsp;
    }
    @Get("getPage")
    @AuthTag('getDicPage')
    @ApiOperation({ description: 'getDicPage:获取数据字典分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() pageForm: DicPageForm, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<DataDictionary>>> {
        const info = new ResponseInfoDto<PageResponseDto<DataDictionary>>(req);
        try {
            if (pageForm.dicClass) {
                info.success(`成功`, await this.dataDictionaryService.getPage(pageForm, DIC_TYPE.value));
            } else {
                info.success(`成功`, await this.dataDictionaryService.getPage(pageForm, DIC_TYPE.class, pageForm.dicClass));
            }
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getTree")
    @AuthTag('getDicTree')
    @ApiOperation({ description: 'getDicTree:获取数据字典树' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getTree(@Req() req: any): Promise<ResponseInfoDto<DicTree[]>> {
        const info = new ResponseInfoDto<DicTree[]>(req);
        try {
            info.success(`成功`, await this.dataDictionaryService.getTree());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Post("createDicEnum")
    @AuthTag('createDicEnum')
    @ApiOperation({ description: 'createDicEnum:创建数据字典枚举文件' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async createDicEnum(@Req() req: any): Promise<ResponseInfoDto<any>> {
        const info = new ResponseInfoDto<any>(req);
        try {
            info.success(`成功`, await this.dataDictionaryService.createDic());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
