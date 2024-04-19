import axios from "axios";
import { MpTplMsgRequestDto } from "./mp-tpl-msg-request.dto";

/**
 * 微信公众号相关api操作
 */
export class WxMpDto {

    private BASE_URL = 'https://api.weixin.qq.com';
    private BAK_BASE_URL = 'https://api2.weixin.qq.com';
    /**
     * 唯一凭证
     */
    private appid: string;
    /**
     * 凭证密钥
     */
    private secret: string;
    /**
     * 统一接口凭证
     */
    private accessToken: string;
    /**
     * 
     * @param appid 唯一凭证
     * @param secret 凭证密钥
     */
    constructor(appid: string, secret: string, accessToken?: string) {
        this.appid = appid;
        this.secret = secret;
        if (accessToken) {
            this.accessToken = accessToken;
        }
    }
    setAccessToken(access_token: string) {
        this.accessToken = access_token;
        return this;
    }
    /**
     * 获取一个新的AccessToken
     * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/getStableAccessToken.html
     */
    async getAccessToken(refresh = false) {
        const { data } = await axios.post(`${this.BASE_URL}/cgi-bin/stable_token`,
            {
                grant_type: 'client_credential',
                appid: this.appid,
                secret: this.secret,
                force_refresh: refresh
            }
        );
        console.log('获取accessToken结果', data);
        const { access_token, expires_in } = data;
        if (access_token) {
            return { access_token, expires_in }
        } else {
            const { errcode, errmsg } = data;
            if (errcode) {
                throw new Error(`${errmsg}:${AccessErrorText[errcode]}`);
            }
        }
    }

    /**
     * 获取消息模板列表
     * @returns 模板列表
     */
    async getTemplateList() {
        const { data: { template_list } } = await axios.get(`${this.BASE_URL}/cgi-bin/template/get_all_private_template?access_token=${this.accessToken}`)
        return template_list;
    }

    /**
     * 发送模板消息
     * https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Template_Message_Interface.html#%E5%8F%91%E9%80%81%E6%A8%A1%E6%9D%BF%E6%B6%88%E6%81%AF
     */
    async sendTplMsg(req: MpTplMsgRequestDto) {
        // FIXME: 正式上线后，可以使用小程序跳转
        delete req.miniprogram;
        const { data } = await axios.post(
            `${this.BASE_URL}/cgi-bin/message/template/send?access_token=${this.accessToken}`,
            req
        )
        const { errcode, errmsg, msgid } = data;
        if (errcode == 0) {
            return data;
        } else {
            throw new Error(`${SendTplErrorText[errcode]},${errmsg}`);
        }
    }

    /**
     * 获取用户列表
     * https://developers.weixin.qq.com/doc/offiaccount/User_Management/Getting_a_User_List.html
     * @param NEXT_OPENID 最后一个openid,为空则从第一个开始拉取
     */
    async getUserList(NEXT_OPENID?: string) {
        const { data } = await axios(`${this.BASE_URL}/cgi-bin/user/get?access_token=${this.accessToken}&next_openid=${NEXT_OPENID}`)
        if (data?.errcode) {
            throw new Error(JSON.stringify(data));
        }
        // console.log('查询结果', data);
        return data;
    }
    /**
     * https://developers.weixin.qq.com/doc/offiaccount/User_Management/Get_users_basic_information_UnionID.html#UinonId
     * 批量获取用户详情
     */
    async batchGetUserDetails(req: UserListReq): Promise<UserInfoListRes> {
        if (req.user_list.length < 1) {
            throw new Error("最少获取1个");
        }
        if (req.user_list.length > 100) {
            throw new Error("最多可以获取100个");
        }
        const { data } = await axios.post(
            `${this.BASE_URL}/cgi-bin/user/info/batchget?access_token=${this.accessToken}`,
            req
        );
        if (data?.errcode) {
            throw new Error(JSON.stringify(data));
        }
        const res: UserInfoListRes = data;
        return res;
    }
}
/**
 * 获取用户详情，请求参数
 */
export class UserListReq {
    user_list: UserListItem[]

}
/**
 * 获取用户详情列表结果
 */
export class UserInfoListRes {
    user_info_list: UserInfoItem[];
}
export class UserInfoItem {
    /**
     * 是否关注了公众号，0未关注，1关注
     */
    "subscribe": number;
    "openid"?: string;
    "language"?: string;
    /**
     * 关注时间戳
     */
    "subscribe_time"?: number;
    "unionid"?: string;
    /**
     * 公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注
     */
    "remark": string;
    /**
     * 用户所在的分组ID（暂时兼容用户分组旧接口）
     */
    "groupid": number;
    /**
     * 用户被打上的标签ID列表
     */
    "tagid_list": Array<number>;
    /**
     * 返回用户关注的渠道来源
     */
    "subscribe_scene": string;
    /**
     * 二维码扫码场景（开发者自定义）
     */
    "qr_scene": number;
    /**
     * 二维码扫码场景描述（开发者自定义）
     */
    "qr_scene_str": string;
}
/**
 * 获取用户详情，请求参数
 */
export class UserListItem {
    openid: string;
    /**
     * zh_CN 简体，zh_TW 繁体，en 英语，默认为zh-CN
     */
    lang: 'zh_CN'
}
/**
 * 发送模板消息错误提示
 */
const SendTplErrorText = {
    '43116': '该模板因滥用被滥用过多，已被限制下发',
    '40249': '不支持下发营销/推广类的消息内容',
    '40250': '下发消息内容不规范（包含空值等），建议检查内容规范性后再下发',
    '40251': '因历史违规导致平台限制账号调用上限，当前已到达下发上限',
    '40252': '正在调用的模板下发的部分内容已进入平台审核流程，在审核完成前，相关内容暂时无法下发',
}
/**
 * 获取access错误提示
 */
const AccessErrorText = {
    '-1': '系统繁忙，此时请开发者稍候再试',
    '0': '成功',
    '40001': 'AppSecret错误或者AppSecret不属于这个公众号，请开发者确认AppSecret的正确性',
    '40002': '请确保grant_type字段值为client_credential',
    '40164': '调用接口的IP地址不在白名单中，请在接口IP白名单中进行设置。',
    '40243': 'AppSecret已被冻结，请登录MP解冻后再次调用。',
    '89503': '此IP调用需要管理员确认,请联系管理员',
    '89501': '此IP正在等待管理员确认,请联系管理员',
    '89506': '24小时内该IP被管理员拒绝调用两次，24小时内不可再使用该IP调用',
    '89507': '1小时内该IP被管理员拒绝调用一次，1小时内不可再使用该IP调用',
}