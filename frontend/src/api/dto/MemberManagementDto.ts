export class MemberManagementDto {

    _id?: string;
    /**
     * 最后更新用户
     */
    addUser?: string;
    
    /**
     * 添加时间
     */
    addDate?: string;
    
    /**
     * 最后更新用户
     */
    updateUser?: string;
    
    /**
     * 最后更新时间
     */
    updateDate?: string;
    
    /**
     * 文件UUID数组，只要文章上传文件，保留原有数据且把上传的文件UUID都push到该数组中。
     */
    fileIds?: string[];
    
    /**
     * 用户名称
     */
    userName!: string;
    
    /**
     * 用户头像
     */
    avatar!: string;
    
    /**
     * 用户UUID
     */
    UUID!: string;
    
    /**
     * openId
     */
    openId!: string;
    
    /**
     * UnionID
     */
    unionID!: string;
    
    /**
     * 会员二维码
     */
    memberQR!: string;
    
    /**
     * 性别：1男，2女，0未知
     */
    sex!: number;
    
    /**
     * 年龄
     */
    age!: number;
    
    /**
     * 电话号码
     */
    phoneNumber!: string;
    
    /**
     * 用户角色
     */
    role!: string[];
    
    /**
     * 会员等级
     */
    rank!: string;
    
    /**
     * 会员等级名称
     */
    rankText!: string;
    
    /**
     * 用户socket连接的id,不为空则在线，为空则不在线
     */
    socketId!: string;
    
}