import { Body, Controller, Get, Param, Post, Req, Type, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { userInfo } from 'os';
import { AdminUserService } from 'src/admin-user/admin-user.service';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { WeChatRegister } from 'src/member-manger/dto/wechat-register.dto';
import { MemberMangerService } from 'src/member-manger/member-manger.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { RolePermissionsService } from 'src/role-permissions/role-permissions.service';
import { SystemLogService } from 'src/system-log/system-log.service';
import { LOGIN_QR_STATUS } from 'src/wechat-api/dto/enum.dto';
import { json } from 'stream/consumers';
import { decode, encode } from 'utf8';
import { AuthService } from './auth.service';
import { LoginFrom } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { PowerGuard } from './guard/power.guard';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('鉴权')
@Controller('auth')
@ApiExtraModels(ResponseInfoDto)
export class AuthController {

    constructor(private readonly jwtService: JwtService,
        private readonly adminUserService: AdminUserService,
        private readonly systemLogService: SystemLogService,
        private readonly rolePermissionsService: RolePermissionsService,
        private readonly authService: AuthService,
        private readonly memberMangerService: MemberMangerService,
        private redisCacheService: RedisCacheService
    ) { }

    @Post('/admin/login')
    @ApiOperation({ description: '后台用户登录' })
    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ResponseInfoDto) },
                {
                    properties: {
                        data: {
                            type: 'string',
                        },
                    },
                },
            ],
        },
        status: 200,
        description: 'data：成功时返回token，失败时返回失败原因'
    })
    async login(@Body() loginForm: LoginFrom, @Req() req): Promise<ResponseInfoDto<String>> {
        if (loginForm.userName && loginForm.password) {
            let user = await this.adminUserService.getAdminUserByUserNameAndPassWord(loginForm.userName, loginForm.password);
            if (user) {
                //重新设置用户首页
                if (!user.indexPath) {
                    const role = await this.rolePermissionsService.getRoleById(user.role[0]);
                    user.indexPath = role.indexPath;
                }
                const singString = encode(JSON.stringify(user));
                this.systemLogService.create('鉴权', `用户登录成功：${decode(singString)}`, req);
                return new ResponseInfoDto<String>().success('登录成功', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
            } else {
                this.systemLogService.create('鉴权', `用户登录失败：${JSON.stringify(loginForm)}`, req);
                return new ResponseInfoDto<String>().error('登录失败', '账号或密码错误');
            }
        } else {
            return new ResponseInfoDto<String>().error('登录失败', '请输入账号密码');
        }
    }
    @Post('/weChat/login/:code')
    @ApiOperation({ description: '小程序用户登录' })
    async weChatLogin(@Param('code') code: string, @Req() req): Promise<ResponseInfoDto<any>> {
        const openid = await this.authService.getOpenId(code);
        const member = await this.memberMangerService.getMemberByOpenId(openid);
        if (member) {
            const singString = encode(JSON.stringify(member));
            this.systemLogService.create('鉴权', `微信登录成功：${decode(singString)}`, req);
            return new ResponseInfoDto<String>().success('微信登录成功：', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
        } else {
            if (openid) {
                return new ResponseInfoDto<any>().error('新注册', openid);
            } else {
                return new ResponseInfoDto<any>().error('openid获取异常');
            }
        }
    }
    @Post('/weChat/loginRefresh')
    @ApiOperation({ description: '小程序用户登录刷新' })
    @UseGuards(JwtAuthGuard)
    async weChatLoginRefresh(@Req() req: any): Promise<ResponseInfoDto<any>> {
        const member = await this.memberMangerService.getMemberByUUID(req.user.UUID);
        const singString = encode(JSON.stringify(member));
        return new ResponseInfoDto<String>().success('刷新成功', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
    }
    @Post('/admin/loginRefresh')
    @ApiOperation({ description: '后台用户登录' })
    @UseGuards(JwtAuthGuard)
    async adminLoginRefresh(@Req() req: any): Promise<ResponseInfoDto<any>> {
        const member = await this.adminUserService.getAdminUserById(req.user._id);
        const singString = encode(JSON.stringify(member));
        this.systemLogService.create('鉴权', `微信登录成功：${decode(singString)}`, req);
        return new ResponseInfoDto<String>().success('微信登录成功：', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
    }
    @Post('/weChat/register')
    @ApiOperation({ description: '小程序新用户授权注册并登录' })
    async register(@Body() weChatRegister: WeChatRegister, @Req() req: any): Promise<ResponseInfoDto<any>> {
        let member = await this.memberMangerService.getMemberByOpenId(weChatRegister.openId);
        if (!member) {
            try {
                member = await this.memberMangerService.createMemberManger(weChatRegister);
            } catch (error) {
                return new ResponseInfoDto<any>().error(error.toString());
            }
        }
        if (member) {
            const singString = encode(JSON.stringify(member));
            this.systemLogService.create('鉴权', `微信注册并登录成功：${decode(singString)}`, req);
            return new ResponseInfoDto<String>().success('微信注册并登录成功：', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
        } else {
            return new ResponseInfoDto<any>().error('注册失败');
        }
    }
    @Post('/weChat/phoneNumber/:code')
    @AuthTag('phoneNumber')
    @ApiOperation({ description: 'phoneNumber:获取小程序用户手机号' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async getWeChatPhoneNumber(@Param('code') code: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        try {
            const { data } = await this.authService.getPhoneNumber(code);
            if (data.errcode == 0) {
                this.memberMangerService.setMemberPhoneNumber(req.user.UUID, data.phone_info.phoneNumber);
                return new ResponseInfoDto<any>().success('成功', data.phone_info.phoneNumber);
            } else {
                return new ResponseInfoDto<string>().error(data.errmsg);
            }

        } catch (error) {
            return new ResponseInfoDto<string>().error(error.toString());
        }
    }
    @Get('/weChat/QRAuthorize/:QRKey')
    @AuthTag('QRAuthorize')
    @ApiOperation({ description: 'QRAuthorize:扫码授权登录' })
    @UseGuards(JwtAuthGuard, PowerGuard)
    async QRAuthorize(@Param('QRKey') QRKey: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const singString = encode(JSON.stringify(req.user));
        this.systemLogService.create('鉴权', `微信扫码授权成功：${decode(singString)}`, req);
        const jwt = this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') });
        this.redisCacheService.set(QRKey, `${LOGIN_QR_STATUS.已授权};${jwt}`);
        return new ResponseInfoDto<String>().success('微信扫码授权登录成功');
    }
}
