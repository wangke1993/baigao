import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { AdminMenuService } from './admin-menu.service';
import { AdminMenuTreeDto } from './dto/admin-menu-tree.dto';
import { AdminMenu } from './dto/admin-menu.schema';

@ApiTags('菜单管理')
@Controller('admin/menu')
export class AdminMenuController {
    constructor(private adminMenuService: AdminMenuService, private systemLogService: SystemLogService) { };
    @Post('create')
    @AuthTag('createMenu')
    @ApiOperation({ description: 'createMenu：新增菜单' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: AdminMenu, @Req() req: any): Promise<ResponseInfoDto<AdminMenu>> {
        this.systemLogService.create('菜单管理', `新增菜单${JSON.stringify(form)}`, req);
        const rsp = new ResponseInfoDto<AdminMenu>();
        try {
            rsp.success('保存成功', await this.adminMenuService.create(form));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }

    @Post('update/:id')
    @AuthTag('updateMenu')
    @ApiOperation({ description: 'updateMenu：编辑菜单' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: AdminMenu, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<AdminMenu>> {
        this.systemLogService.create('菜单管理', `修改菜单${JSON.stringify(form)};id:${id}`, req);
        const rsp = new ResponseInfoDto<AdminMenu>();
        try {
            rsp.success('更新成功', await this.adminMenuService.update(form, id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }

    @Get('getMenu')
    @AuthTag('getMenu')
    @ApiOperation({ description: 'getMenu：获取菜单树' })
    @UseGuards(JwtAuthGuard)
    async getTree(@Req() req: any): Promise<ResponseInfoDto<AdminMenuTreeDto[]>> {
        const rsp = new ResponseInfoDto<AdminMenuTreeDto[]>();
        try {
            if (req.user.isSuper) {
                rsp.success('获取成功', await this.adminMenuService.getTree(0));
            } else {
                rsp.success('获取成功', await this.adminMenuService.getTree(0, req.user.menuIds));
            }
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Get('getMenu/:menuType')
    @AuthTag('getTreeByMenuType')
    @ApiOperation({ description: 'getTreeByMenuType：根据菜单资源属性获取菜单树' })
    @UseGuards(JwtAuthGuard)
    async getTreeByMenuType(@Param("menuType") menuType: number, @Req() req: any): Promise<ResponseInfoDto<AdminMenuTreeDto[]>> {
        const rsp = new ResponseInfoDto<AdminMenuTreeDto[]>();
        try {
            if (req.user.isSuper) {
                rsp.success('获取成功', await this.adminMenuService.getTree(menuType));
            } else {
                rsp.success('获取成功', await this.adminMenuService.getTree(menuType, req.user.menuIds));
            }
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
    @Delete('delete/:id')
    @AuthTag('deleteMenu')
    @ApiOperation({ description: 'deleteMenu：删除菜单' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        this.systemLogService.create('菜单管理', `删除菜单${id}`, req);
        const rsp = new ResponseInfoDto<any>();
        try {
            rsp.success('删除成功', await this.adminMenuService.deleteById(id));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
}
