import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { MemberManagementService } from '../member-management/member-management.service';
import { readFileSync } from 'fs';
import { SystemConfigService } from '../system-config/system-config.service';
import { TransferDetailDto } from './dto/transfer-detail.dto';
import { v4 as uuidV4 } from 'uuid';
import { TransactionHelper } from 'src/transaction/transaction.helper';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { LOGIN_QR_STATUS } from './dto/enum.dto';
import { DC0005, DC0014 } from 'src/data-dictionary/dic-enum';
import { CONF_TYPE } from 'src/system-config/dto/system-config.schema';
import { PayResDto } from './dto/payRes.dto';
import { TransferToChangeResultDto } from './dto/transfer-to-change-result.dto';
import { UUID } from 'src/utils/random-tools';
import { WxMpUserService } from './wx-mp-user.service';
import { MpTplMsgRequestDto } from './dto/mp-tpl-msg-request.dto';
import { WxMpDto } from './dto/wx-mp.dto';
import { WxMpUserDto } from './dto/wx-mp-user.dto';
const WxPay = require('wechatpay-node-v3');
/**
 * 
 * 微信公众号相关api
 */
@Injectable()
export class WxMPApiService {
    private readonly logger = new Logger(WxMPApiService.name);
    private payConfig: any;
    constructor(
        private memberManagementService: MemberManagementService,
        private wxMpUserService: WxMpUserService,
        private systemConfigService: SystemConfigService,
        private transaction: TransactionHelper,
        private redisCacheService: RedisCacheService,

    ) {

    };
    async init(): Promise<WxMpDto> {
        const mpConf = await this.systemConfigService.getConfigObjByConfType('DC0014');
        if (mpConf[DC0014.appid] && mpConf[DC0014.secret]) {
            const key = mpConf[DC0014.appid];
            const access_token = await this.redisCacheService.get(key);
            // const access_token = "";
            if (access_token) {
                return new WxMpDto(
                    mpConf[DC0014.appid],
                    mpConf[DC0014.secret],
                    access_token
                );
            } else {
                // 获取accessToken
                const wxMpDto = new WxMpDto(
                    mpConf[DC0014.appid],
                    mpConf[DC0014.secret]
                );
                const { access_token, expires_in } = await wxMpDto.getAccessToken();
                await this.redisCacheService.set(key, access_token, expires_in);
                return wxMpDto.setAccessToken(access_token);
            }
        } else {
            throw new Error("请配置appid和secret后再使用");
        }
    }
    /**
     * 获取微信公众号用户信息
     */
    async getAllMpUserInfo(req: any): Promise<any> {
        const wxMpApi = await this.init();
        const getAll = async (next_openid = ""): Promise<string[]> => {
            try {
                // 查询微信公众号的用户，并存储
                const { total, count, data, next_openid: n_openid } = await wxMpApi.getUserList(next_openid);
                let res = [];
                if (data.openid) {
                    res = res.concat(data.openid);
                }
                if (total > 10000 && data?.openid && data.openid.length == 10000) {
                    res = res.concat(await getAll(n_openid));
                }
                return res;
            } catch (e) {
                throw new Error(e);
            }

        }
        let openids: string[] = await getAll();
        console.log('总数', openids.length);
        if (openids.length > 0) {
            // 清理取消关注的用户
            await this.wxMpUserService.deleteNotInOpenIds(openids);
            // 计算需要插入的用户
            openids = await this.wxMpUserService.getNewUser(openids);
            console.log('新用户', openids);
            let start = 0;
            let end = 99;
            let now = new Date();
            let userInfoList = [];
            const install = async () => {
                console.log('批次', start + '-' + end);
                const hundred = openids.slice(start, end);
                now = new Date(now.getTime() + start);
                // 查询微信公众号用户的，详情并存储
                const { user_info_list } = await wxMpApi.batchGetUserDetails({ user_list: hundred.map(str => { return { openid: str, lang: 'zh_CN' } }) })
                user_info_list.map((item, i) => {
                    const d = new WxMpUserDto(item, req);
                    d.addDate = new Date(now.getTime() + i);
                    d.updateDate = new Date(now.getTime() + i);
                    // console.log(d);
                    userInfoList.push(d);
                });
                if (openids.length > (end + 1)) {
                    start = end;
                    end += 100;
                    await install();
                }
                return '完成';
            }
            if (openids.length > 0) {
                await install();
                return await this.wxMpUserService.installMany(userInfoList);
            }
        }
    }
    /**
     * 验证用户是否关注了微信公众号
     */
    async verifyWeChatBinding(unionid: string, req: any): Promise<Boolean> {
        let wxMpUser = await this.wxMpUserService.getDetailByUnionid(unionid);
        if (wxMpUser) {
            // 原来有数据，查询最新的数据
            const { user_info_list } = await (await this.init()).batchGetUserDetails({ user_list: [{ openid: wxMpUser.openid, lang: 'zh_CN' }] })
            const newUserInfo = user_info_list.pop();
            if (newUserInfo.subscribe == 1) {
                // 有订阅则更新
                this.wxMpUserService.updateByOpenId(
                    new WxMpUserDto(newUserInfo, req),
                    newUserInfo.openid,
                    req
                );
                return true;
            } else {
                // 无订阅则删除
                this.wxMpUserService.deleteByOpenIds([wxMpUser.openid]);
                return false;
            }
        } else {
            /**
             * 原来没有数据，重新获取所有数据再查询是否存在
             * 性能优化，牺牲部分体验，不做实时检测
             *  每30分钟校验一次，30分钟内所有的请求都不再进行全部拉取
             */
            const key = 'DELAY_BY_30_MINUTES';
            const run = await this.redisCacheService.get(key)
            if (!run) {
                await this.getAllMpUserInfo(req);
                await this.redisCacheService.set(key, true, 30 * 60 * 1000);
            }
            wxMpUser = await this.wxMpUserService.getDetailByUnionid(unionid);
            if (wxMpUser) {
                return true;
            } else {
                return false;
            }
        }
    };
    /**
     * 根据unionid来发送模板消息
     */
    async sendTplMsg(unionid: string, req: MpTplMsgRequestDto) {
        const wxMpDto = await this.init();
        const wxMpUser = await this.wxMpUserService.getDetailByUnionid(unionid);
        if (!wxMpUser) {
            throw new Error("该用户没有关注公众号，无法进行通知");
        }
        req.to(wxMpUser.openid);
        const mpConf = await this.systemConfigService.getConfigObjByConfType("DC0005");
        if (!req.url) {
            req.setMiniProgramAppid(mpConf[DC0005.应用appid]);
        }
        const res = await wxMpDto.sendTplMsg(req);
        this.logger.log('模板消息发送结果', { res });
        return res;
    }
}