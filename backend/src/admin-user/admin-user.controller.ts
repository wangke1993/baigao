import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { SystemLogService } from 'src/system-log/system-log.service';
import { AdminUserService } from './admin-user.service';
import { AdminUser } from './dto/admin-user.schema';
import { INFO_STATUS, ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as crypto from 'crypto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PowerGuard } from 'src/auth/guard/power.guard';

@ApiTags('后台用户管理')
@Controller('adminUser')
export class AdminUserController {
    private SALT_CODE: string;
    constructor(private adminUserService: AdminUserService, private systemLogService: SystemLogService) {
        this.SALT_CODE = process.env.SALT_CODE;
    };
    @Post('create')
    @AuthTag('createAdminUser')
    @ApiOperation({ description: 'createAdminUser:创建后台用户' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async create(@Body() form: AdminUser, @Req() req: any): Promise<ResponseInfoDto<AdminUser>> {
        form.password = crypto.createHash('md5').update(form.password + this.SALT_CODE).digest('hex');
        const info = new ResponseInfoDto<AdminUser>();
        try {
            info.success('成功', await this.adminUserService.create(form));
            this.systemLogService.create('后台用户管理', `新增用户${JSON.stringify(form)}`, req);
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    
    // FIXME 仅用于修改密码盐值后，初始化管理员账号的密码；初始化后记得注释和修改管理员密码
    // @Post('initAdminUser')
    // @ApiOperation({ description: '仅用于修改密码盐值后，初始化管理员账号的密码；初始化后记得注释和修改管理员密码,默认账号:baigao 密码:123456' })
    // async initAdminUser(): Promise<ResponseInfoDto<any>> {
    //     const password = crypto.createHash('md5').update(`123456${this.SALT_CODE}`).digest('hex');
    //     const info = new ResponseInfoDto<AdminUser>();
    //     try {
    //         info.success('成功', await this.adminUserService.initAdminUser(password));
    //     } catch (e) {
    //         info.warring(e.toString());
    //     }
    //     return info;
    // }

    @Post('update/:id')
    @AuthTag('updateAdminUser')
    @ApiOperation({ description: 'updateAdminUser:更新后台用户信息' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async update(@Body() form: AdminUser, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<AdminUser>> {
        delete form.password;
        const info = new ResponseInfoDto<AdminUser>();
        try {
            info.success('成功', await this.adminUserService.update(form, id));
            this.systemLogService.create('后台用户管理', `修改用户${JSON.stringify(form)};id:${id}`, req);
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
    @Post('updatePassword/:id')
    @AuthTag('updateAdminUserPassword')
    @ApiOperation({ description: 'updateAdminUserPassword:后台用户密码修改' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<string>> {
        const adminUser = await this.adminUserService.getAdminUserById(id);
        updatePasswordDto.oldPassword = crypto.createHash('md5').update(updatePasswordDto.oldPassword + this.SALT_CODE).digest('hex');
        if (updatePasswordDto.oldPassword === adminUser.password) {
            const password = crypto.createHash('md5').update(updatePasswordDto.newPassword + this.SALT_CODE).digest('hex');
            await this.adminUserService.updatePassword(password, id);
            this.systemLogService.create('后台用户管理', `修改密码成功：id:${id}`, req);
            return new ResponseInfoDto<string>(INFO_STATUS.success, `修改成功`);
        } else {
            this.systemLogService.create('后台用户管理', `修改密码失败：原密码输入错误;id:${id}`, req);
            return new ResponseInfoDto<string>(INFO_STATUS.error, `原密码输入错误`);
        }
    }
    @Post('resetPassword/:id')
    @AuthTag('resetAdminUserPassword')
    @ApiOperation({ description: 'resetAdminUserPassword:后台用户密码重置' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async resetPassword(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<string>> {
        const info = new ResponseInfoDto<string>();
        try {
            const newPassword = await this.adminUserService.resetPassword(id);
            info.success(`重置成功，新密码为：${newPassword}`, newPassword);
            this.systemLogService.create('后台用户管理', `密码重置成功：id:${id}`, req);
        } catch (e) {
            info.warring(e.toString());
            this.systemLogService.create('后台用户管理', `密码重置失败：id:${id};${e.toString()}`, req);
        }
        return info;
    }

    @Delete('delete/:id')
    @AuthTag('deleteAdminUser')
    @ApiOperation({ description: 'deleteAdminUser:删除后台用户' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async delete(@Param("id") id: string, @Req() req: any): Promise<ResponseInfoDto<string>> {
        const info = new ResponseInfoDto<string>();
        try {
            await this.adminUserService.deleteById(id);
            info.success(`成功`);
            this.systemLogService.create('后台用户管理', `删除用户：id为${id}`, req);
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }

    @Get("getPage")
    @ApiHeader({ name: 'Authorization', description: '示例：Bearer 【Token】' })
    @AuthTag('getAdminUserPage')
    @ApiOperation({ description: 'getAdminUserPage:获取后台用户分页' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getPage(@Query() pageForm: PageRequestDto, @Req() req: any): Promise<ResponseInfoDto<PageResponseDto<AdminUser>>> {
        const info = new ResponseInfoDto<PageResponseDto<AdminUser>>();
        try {
            info.success(`成功`, await this.adminUserService.getPage(pageForm));
        } catch (e) {
            info.warring(e.toString());
        }
        return info;
    }
}
