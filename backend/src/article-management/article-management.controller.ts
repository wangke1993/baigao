import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { ArticleManagementService } from './article-management.service';
import { ArticleManagement } from './dto/article-management.schema';
import { ArticlePageForm } from './dto/article-page-form';

@ApiTags('文章管理')
@Controller('article')
export class ArticleManagementController {
    constructor(private articleManagementService: ArticleManagementService, private systemLogService: SystemLogService) { };
    @Post('create')
    @AuthTag('createArticle')
    @ApiOperation({ description: 'createArticle:创建文章' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: ArticleManagement, @Req() req: any): Promise<ResponseInfoDto<ArticleManagement>> {
        const rsp = new ResponseInfoDto<ArticleManagement>(req);
        try {
            rsp.success('保存成功', await this.articleManagementService.create(form, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('文章管理', `创建文章,${rsp.message},${JSON.stringify(form)}`, req);
        return rsp;
    }

    @Post('update/:id')
    @AuthTag('updateArticle')
    @ApiOperation({ description: 'updateArticle:编辑文章' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: ArticleManagement, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<ArticleManagement>> {
        const rsp = new ResponseInfoDto<ArticleManagement>(req);
        try {
            rsp.success('更新成功', await this.articleManagementService.update(form, id, req));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('文章管理', `编辑文章,${rsp.message},${JSON.stringify(form)},id:${id}`, req);
        return rsp;
    }

    @Get('getDetail/:id')
    @AuthTag('getDetailByArticleId')
    @ApiOperation({ description: 'getDetailByArticleId:根据id获取文章详情，以发布和未发布的均可获取' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getDetailByArticleId(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<ArticleManagement>> {
        const rsp = new ResponseInfoDto<ArticleManagement>(req);
        try {
            rsp.success('获取成功', await this.articleManagementService.getDetailById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Get('getReleaseDetail/:id')
    // @AuthTag('getReleaseDetailByArticleId')
    @ApiOperation({ description: '根据id获取文章详情，仅可获取已发布的文章详情，无需登录' })
    async getReleaseDetailByArticleId(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<ArticleManagement>> {
        const rsp = new ResponseInfoDto<ArticleManagement>(req);
        try {
            rsp.success('获取成功', await this.articleManagementService.getDetailById(id, true));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Delete('delete/:id')
    @AuthTag('deleteArticle')
    @ApiOperation({ description: 'deleteArticle:删除文章' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const rsp = new ResponseInfoDto<any>(req);
        try {
            rsp.success('删除成功', await this.articleManagementService.deleteById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        this.systemLogService.create('文章管理', `删除文章,${rsp.message},${id}`, req);
        return rsp;
    }
    @Get("getPage")
    @AuthTag('getArticlePage')
    @ApiOperation({ description: 'getArticlePage:获取文章分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() pageForm: ArticlePageForm, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<ArticleManagement>>> {
        const info = new ResponseInfoDto<PageResponseDto<ArticleManagement>>(req);
        try {
            info.success(`成功`, await this.articleManagementService.getPage(pageForm));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getList/:articleClass/:count")
    @AuthTag('getArticleList')
    @ApiOperation({ description: 'getArticleList:获取文章列表' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getArticleList(@Param('articleClass') articleClass: String, @Param('count') count: number, @Req() req: any): Promise<ResponseInfoDto<ArticleManagement[]>> {
        const info = new ResponseInfoDto<ArticleManagement[]>(req);
        try {
            info.success(`成功`, await this.articleManagementService.getList(articleClass, count));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getAll")
    @AuthTag('getArticleAll')
    @ApiOperation({ description: 'getArticleAll:获取所有已发布文章列表' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getArticleAll(@Req() req: any): Promise<ResponseInfoDto<ArticleManagement[]>> {
        const info = new ResponseInfoDto<ArticleManagement[]>(req);
        try {
            info.success(`成功`, await this.articleManagementService.getList());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

}
