import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AdminUserService } from 'src/admin-user/admin-user.service';
import { AdminUser } from 'src/admin-user/dto/admin-user.schema';
import { DC0004, DC0008 } from 'src/system-config/dto/system-config.schema';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private adminUserService: AdminUserService,
    private systemConfigService: SystemConfigService,
    private redisCacheService: RedisCacheService
  ) { }

  async validateUser(userName: string, passWord: string): Promise<AdminUser> {
    return await this.adminUserService.getAdminUserByUserNameAndPassWord(userName, passWord);
  }
  async getOpenId(js_code: string): Promise<any> {
    const { data: loginInfo } = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: await this.getAppid(),
        secret: await this.getSecret(),
        js_code,
        grant_type: 'authorization_code'
      }
    });
    this.getAccessToken(loginInfo.openid, true);
    return loginInfo.openid;
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
        this.redisCacheService.set(accessTokenKey, res.access_token, Number(res.expires_in));
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


}