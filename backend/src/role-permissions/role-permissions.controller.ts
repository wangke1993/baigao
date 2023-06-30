import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { RolePermissions } from './dto/role-permissions.schema';
import { RolePermissionsService } from './role-permissions.service';

@ApiTags("角色权限")
@Controller('rolePermissions')
export class RolePermissionsController {
    constructor(private rolePermissionsService: RolePermissionsService, private systemLogService: SystemLogService) { };
    @Post('create')
    @AuthTag('createRole')
    @ApiOperation({ description: 'createRole:创建角色权限' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: RolePermissions, @Req() req: any): Promise<ResponseInfoDto<RolePermissions>> {
        const info = new ResponseInfoDto<RolePermissions>();
        try {
            info.success(`成功`, await this.rolePermissionsService.create(form));
            this.systemLogService.create('角色权限', `新增角色${JSON.stringify(form)}`, req);
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Post('update/:id')
    @AuthTag('updateRole')
    @ApiOperation({ description: 'updateRole:修改角色权限' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: RolePermissions, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<RolePermissions>> {
        const info = new ResponseInfoDto<RolePermissions>();
        try {
            info.success(`成功`, await this.rolePermissionsService.update(form, id));
            this.systemLogService.create('角色权限', `修改角色${JSON.stringify(form)};id:${id}`, req);
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Delete('delete/:id')
    @AuthTag('deleteRole')
    @ApiOperation({ description: 'deleteRole:删除角色权限' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<string>> {
        const info = new ResponseInfoDto<string>();
        try {
            await this.rolePermissionsService.deleteById(id)
            info.success(`成功`);
            this.systemLogService.create('角色权限', `删除角色${id}`, req);
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Get("getPage")
    @AuthTag('getRolePage')
    @ApiOperation({ description: 'getRolePage:获取角色权限分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() pageForm: PageRequestDto, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<RolePermissions>>> {
        const info = new ResponseInfoDto<PageResponseDto<RolePermissions>>();
        try {
            info.success(`成功`, await this.rolePermissionsService.getPage(pageForm));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Get("getList")
    @AuthTag('getRoleList')
    @ApiOperation({ description: 'getRoleList:获取角色权限列表' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getList(): Promise<ResponseInfoDto<RolePermissions[]>> {
        const info = new ResponseInfoDto<RolePermissions[]>();
        try {
            info.success(`成功`, await this.rolePermissionsService.getList());
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
