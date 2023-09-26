export class WeChatRegisterDto {

    _id?: string;
    /**
     * openid
     */
    openId!: string;
    
    /**
     * 用户名称
     */
    userName!: string;
    
    /**
     * 用户头像
     */
    avatar!: string;
    
    /**
     * 用户性别
     */
    sex!: string;
    
    /**
     * 上级openId
     */
    parentOpenId!: string;
    
}