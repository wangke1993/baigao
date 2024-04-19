import { Body, Controller, Get, Param, Post, Req, Type, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { userInfo } from 'os';
import { AdminUserService } from 'src/admin-user/admin-user.service';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AuthTag } from 'src/decorator/auth-tag.decorator';
import { WeChatRegister } from 'src/member-management/dto/wechat-register.dto';
import { MemberManagementService } from 'src/member-management/member-management.service';
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

        private readonly authService: AuthService,
        private readonly memberManagementService: MemberManagementService,
        private redisCacheService: RedisCacheService
    ) { }

    @Post('/admin/login')
    @ApiOperation({ description: '后台用户登录' })
    @ApiOkResponse({
        status: 200,
        description: 'data：成功时返回token，失败时返回失败原因'
    })
    async login(@Body() loginForm: LoginFrom, @Req() req: any): Promise<ResponseInfoDto<String>> {
        const info = new ResponseInfoDto<string>(req);
        if (loginForm.userName && loginForm.password) {
            try {
                const singString = await this.authService.adminLogin(loginForm, req);
                info.success("登录成功", singString);
                this.systemLogService.create('鉴权', `用户登录成功：${decode(singString)}`, req);
            } catch (error) {
                info.error("登录失败", error.message);
                this.systemLogService.create('鉴权', `用户登录失败：${JSON.stringify(loginForm)};${error.message}`, req);
            }
        } else {
            info.error('登录失败', '请输入账号密码')
        }
        return info;
    }

    @Post('/weChat/login/:code')
    @ApiOperation({ description: '小程序用户登录' })
    async weChatLogin(@Param('code') code: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const { unionid, openid } = await this.authService.getOpenId(code);
        const member = await this.memberManagementService.getMemberByOpenId(openid);
        if (member) {
            if (!member.unionID && unionid) {
                // 补充unionID
                member.unionID = unionid;
                await this.memberManagementService.update(member, member._id, req);
            }
            const singString = encode(JSON.stringify(member));
            this.systemLogService.create('鉴权', `微信登录成功：${decode(singString)}`, req);
            return new ResponseInfoDto<String>(req).success('微信登录成功：', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
        } else {
            if (openid) {
                if (unionid) {
                    // 存储unionid，注册的时候写入会员30分钟内有效
                    const key = `register-${openid}`;
                    await this.redisCacheService.set(key, unionid, 30 * 60);
                }
                return new ResponseInfoDto<any>(req).error('新注册', openid);
            } else {
                return new ResponseInfoDto<any>(req).error(req, 'openid获取异常');
            }
        }
    }
    @Post('/weChat/loginRegistration/:code')
    @ApiOperation({ description: '小程序用户登录' })
    async weChatLoginRegistration(@Param('code') code: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
        const { unionid, openid } = await this.authService.getOpenId(code);
        let member = await this.memberManagementService.getMemberByOpenId(openid);
        if (!member) {
            // 用户不存在则创建，登录即注册
            const weChatRegister = new WeChatRegister();
            weChatRegister.openId = openid;
            weChatRegister.unionid = unionid;
            member = await this.memberManagementService.createMemberManagement(weChatRegister);
        }
        if (member) {
            if (!member.unionID && unionid) {
                // 补充unionID
                member.unionID = unionid;
                await this.memberManagementService.update(member, member._id, req);
            }
            const singString = encode(JSON.stringify(member));
            this.systemLogService.create('鉴权', `微信登录成功：${decode(singString)}`, req);
            return new ResponseInfoDto<String>(req).success('微信登录成功：', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
        } else {
            if (openid) {
                if (unionid) {
                    // 存储unionid，注册的时候写入会员30分钟内有效
                    const key = `register-${openid}`;
                    await this.redisCacheService.set(key, unionid, 30 * 60);
                }
                return new ResponseInfoDto<any>(req).error('新注册', openid);
            } else {
                return new ResponseInfoDto<any>(req).error(req, 'openid获取异常');
            }
        }
    }

    // FIXME: 使用openid登录，仅用于本地调试使用，线上环境请注释掉
    // @Post('/weChat/loginOpenId/:openid')
    // @ApiOperation({ description: '小程序用户登录用openid登录' })
    // async loginOpenId(@Param('openid') openid: string, @Req() req: any): Promise<ResponseInfoDto<any>> {
    //     const member = await this.memberManagementService.getMemberByOpenId(openid);
    //     const singString = encode(JSON.stringify(member));
    //     this.systemLogService.create('鉴权', `微信登录成功：${decode(singString)}`, req);
    //     return new ResponseInfoDto<String>(req).success('微信登录成功：', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
    // }

    @Post('/weChat/loginRefresh')
    @ApiOperation({ description: '小程序用户登录刷新' })
    @UseGuards(JwtAuthGuard)
    async weChatLoginRefresh(@Req() req: any): Promise<ResponseInfoDto<any>> {
        const member = await this.memberManagementService.getMemberByUUID(req.user.UUID);
        const singString = encode(JSON.stringify(member));
        return new ResponseInfoDto<String>(req).success('刷新成功', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
    }
    @Post('/admin/loginRefresh')
    @ApiOperation({ description: '后台用户登录' })
    @UseGuards(JwtAuthGuard)
    async adminLoginRefresh(@Req() req: any): Promise<ResponseInfoDto<any>> {
        const member = await this.adminUserService.getAdminUserById(req.user._id);
        const singString = encode(JSON.stringify(member));
        this.systemLogService.create('鉴权', `微信登录成功：${decode(singString)}`, req);
        return new ResponseInfoDto<String>(req).success('微信登录成功：', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
    }
    @Post('/weChat/register')
    @ApiOperation({ description: '小程序新用户授权注册并登录' })
    async register(@Body() weChatRegister: WeChatRegister, @Req() req: any): Promise<ResponseInfoDto<any>> {
        let member = await this.memberManagementService.getMemberByOpenId(weChatRegister.openId);
        if (!member) {
            try {
                member = await this.memberManagementService.createMemberManagement(weChatRegister);
            } catch (error) {
                return new ResponseInfoDto<any>(req).error(error.toString());
            }
        }
        if (member) {
            if (!member.userName) {
                // 补充资料
                if (!weChatRegister.avatar || !weChatRegister.userName) {
                    return new ResponseInfoDto<any>(req).error("头像和名称不能为空");
                }
                member.avatar = weChatRegister.avatar;
                member.userName = weChatRegister.userName;
                await this.memberManagementService.updateByUUID(member, member.UUID, req);
            }
            const singString = encode(JSON.stringify(member));
            this.systemLogService.create('鉴权', `微信注册并登录成功：${decode(singString)}`, req);
            return new ResponseInfoDto<String>(req).success('微信注册并登录成功：', this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') }));
        } else {
            return new ResponseInfoDto<any>(req).error('注册失败');
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
                this.memberManagementService.setMemberPhoneNumber(req.user.UUID, data.phone_info.phoneNumber);
                return new ResponseInfoDto<any>(req).success('成功', data.phone_info.phoneNumber);
            } else {
                return new ResponseInfoDto<string>(req).error(data.errmsg);
            }

        } catch (error) {
            return new ResponseInfoDto<string>(req).error(error.toString());
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
        return new ResponseInfoDto<String>(req).success('微信扫码授权登录成功');
    }
}
