import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AdminUserService } from 'src/admin-user/admin-user.service';
import { AdminUser } from 'src/admin-user/dto/admin-user.schema';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { LoginFrom } from './dto/login.dto';
import { RolePermissionsService } from 'src/role-permissions/role-permissions.service';
import { decode, encode } from 'utf8';
import { JwtService } from '@nestjs/jwt';
import { DC0004 } from 'src/data-dictionary/dic-enum';
@Injectable()
export class AuthService {
  constructor(
    private adminUserService: AdminUserService,
    private systemConfigService: SystemConfigService,
    private readonly rolePermissionsService: RolePermissionsService,
    private readonly jwtService: JwtService,
    private redisCacheService: RedisCacheService
  ) { }

  async validateUser(userName: string, passWord: string): Promise<AdminUser> {
    return await this.adminUserService.getAdminUserByUserNameAndPassWord(userName, passWord);
  }
  async getOpenId(js_code: string): Promise<any> {
    const { data } = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: await this.getAppid(),
        secret: await this.getSecret(),
        js_code,
        grant_type: 'authorization_code'
      }
    });
    console.log(data);
    const { unionid, openid, errcode, errmsg } = data;
    if (errcode) {
      throw new Error(errmsg);
    }
    /**
     * TODO: 获取unionId,需要微信公众号和小程序绑定同一开放平台，
     * 参考：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/union-id.html
     * 参考：https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
     */
    // console.log({ loginInfo });
    this.getAccessToken(openid, true);
    return { unionid, openid };
  }
  async getPhoneNumber(code: string, openId?: string): Promise<any> {
    return axios.post(`https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${await this.getAccessToken(openId)} `, { code });
  }
  async getAccessToken(openId?: string, reset?: boolean): Promise<any> {
    if (openId) {
      const accessTokenKey = `bg_${openId}`;
      const accessToken = await this.redisCacheService.get(accessTokenKey);
      if (!accessToken || reset) {
        const res = await this.setAccessToken();
        this.redisCacheService.set(accessTokenKey, res.access_token, 3600);
        return res.access_token;
      } else {
        return accessToken;
      }
    } else {
      return (await this.setAccessToken()).access_token;
    }

  }
  async setAccessToken(): Promise<any> {
    const { data: res } = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
      params: {
        appid: await this.getAppid(),
        secret: await this.getSecret(),
        grant_type: 'client_credential'
      }
    });
    return res;
  }

  async getAppid(): Promise<string> {
    const key = 'WE_CHAT_APP_ID'
    let appid = await this.redisCacheService.get(key);
    if (!appid) {
      appid = await this.systemConfigService.getValueByConfSelect(DC0004.appID);
    }
    return appid;
  }
  async getSecret(): Promise<string> {
    const key = 'WE_CHAT_SECRET'
    let appid = await this.redisCacheService.get(key);
    if (!appid) {
      appid = await this.systemConfigService.getValueByConfSelect(DC0004.appSecret);
    }
    return appid;
  }

  async adminLogin(loginForm: LoginFrom, req: any): Promise<string> {
    const user = await this.adminUserService.getAdminUserByUserNameAndPassWord(loginForm.userName, loginForm.password);
    if (user) {
      if (user.disable) {
        throw new Error("账号被禁用");
      }
      //重新设置用户首页
      if (!user.indexPath) {
        const role = await this.rolePermissionsService.getRoleById(user.role[0]);
        user.indexPath = role.indexPath;
      }
      const singString = encode(JSON.stringify(user));
      return this.jwtService.sign({ userInfo: Buffer.from(decode(singString)).toString('base64') });
    } else {
      // 账号30分钟内登错五次，账号冻结30分钟
      let userCount = 1;
      let m = 30;
      const oldUserCount = await this.redisCacheService.get(loginForm.userName);
      if (oldUserCount) {
        userCount += Number(oldUserCount);
        const ttl = await this.redisCacheService.set(loginForm.userName, userCount);
        m = ttl / 60;
      } else {
        await this.redisCacheService.set(loginForm.userName, userCount, 30 * 60);
      }
      // session30分钟内登错五次，session冻结30分钟
      let sessionCount = 1;
      const oldSessionCount = await this.redisCacheService.get(req.sessionID);
      if (oldSessionCount) {
        sessionCount += Number(oldSessionCount);
        const ttl = await this.redisCacheService.set(req.sessionID, sessionCount);
        const temp = ttl / 60;
        if (temp > m) {
          m = temp;
        }
      } else {
        await this.redisCacheService.set(req.sessionID, sessionCount, 30 * 60);
      }
      console.log(oldSessionCount, oldUserCount);
      if (oldSessionCount >= 5 || oldUserCount >= 5) {
        throw new Error(`连续5次登录失败，请${m.toFixed(0)}分钟后再试`);
      }
      throw new Error("账号或密码错误");
    }
  }
}