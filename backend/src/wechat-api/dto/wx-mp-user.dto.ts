import { ApiProperty } from "@nestjs/swagger";
import { BaseDTO } from "src/common-dto/base.dto";
import { UserInfoItem } from "./wx-mp.dto";

export class WxMpUserDto extends BaseDTO {

    constructor(userInfoItem: UserInfoItem, req: any) {
        super(req);
        this.subscribe = userInfoItem.subscribe;
        this.groupid = userInfoItem.groupid;
        this.openid = userInfoItem.openid;
        this.qr_scene = userInfoItem.qr_scene;
        this.qr_scene_str = userInfoItem.qr_scene_str;
        this.remark = userInfoItem.remark;
        this.subscribe_scene = userInfoItem.subscribe_scene;
        this.subscribe_time = userInfoItem.subscribe_time;
        this.tagid_list = userInfoItem.tagid_list;
        this.unionid = userInfoItem.unionid;
        if (userInfoItem.subscribe_scene) {
            this.subscribe_scene_text = SubscribeSceneText[userInfoItem.subscribe_scene];
        }
    }
    /**
     * 是否关注公众号 1关注，0没关注
     */
    @ApiProperty({
        description: 'subscribe',
        required: true
    })
    subscribe: number;
    /**
    * openid
    */
    @ApiProperty({
        description: 'openid',
        required: true
    })
    openid: string;


    /**
    * 关注时间
    */
    @ApiProperty({
        description: '关注时间',
        required: false
    })
    subscribe_time: number;


    /**
    * unionid
    */
    @ApiProperty({
        description: 'unionid',
        required: false
    })
    unionid: string;


    /**
    * 备注
    */
    @ApiProperty({
        description: '备注',
        required: false
    })
    remark: string;


    /**
    * groupid
    */
    @ApiProperty({
        description: 'groupid',
        required: false
    })
    groupid: number;


    /**
    * 标签ID列表
    */
    @ApiProperty({
        description: '标签ID列表',
        required: false
    })
    tagid_list: number[];


    /**
    * 用户来源
    */
    @ApiProperty({
        description: '用户来源',
        required: false
    })
    subscribe_scene: string;

    /**
    * 用户来源说明
    */
    @ApiProperty({
        description: '用户来源说明',
        required: false
    })
    subscribe_scene_text: string;


    /**
    * 二维码场景
    */
    @ApiProperty({
        description: '二维码场景',
        required: false
    })
    qr_scene: number;


    /**
    * 二维码场景描述
    */
    @ApiProperty({
        description: '二维码场景描述',
        required: false
    })
    qr_scene_str: string;


}
const SubscribeSceneText = {
    "ADD_SCENE_SEARCH": "公众号搜索",
    "ADD_SCENE_ACCOUNT_MIGRATION": "公众号迁移",
    "ADD_SCENE_PROFILE_CARD": "名片分享",
    "ADD_SCENE_QR_CODE": "扫描二维码",
    "ADD_SCENE_PROFILE_LINK": "图文页内名称点击",
    "ADD_SCENE_PROFILE_ITEM": "图文页右上角菜单",
    "ADD_SCENE_PAID": "支付后关注",
    "ADD_SCENE_WECHAT_ADVERTISEMENT": "微信广告",
    "ADD_SCENE_REPRINT": "他人转载",
    "ADD_SCENE_LIVESTREAM": "视频号直播",
    "ADD_SCENE_CHANNELS": "视频号",
    "ADD_SCENE_OTHERS": "其他"
}