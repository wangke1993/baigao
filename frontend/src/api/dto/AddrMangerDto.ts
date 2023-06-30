export class AddrMangerDto {

    /**
     * 最后更新用户
     */
    addUser?: String;
    
    /**
     * 添加时间
     */
    addDate?: String;
    
    /**
     * 最后更新用户
     */
    updateUser?: String;
    
    /**
     * 最后更新时间
     */
    updateDate?: String;
    
    /**
     * 文件id数组，只要文章上传文件，保留原有数据且把上传的文件id都push到该数组中。
     */
    fileIds?: String[];
    
    /**
     * 所属会员
     */
    memberUUID!: String;
    
    /**
     * 省
     */
    province!: String;
    
    /**
     * 市
     */
    city!: String;
    
    /**
     * 区
     */
    area!: String;
    
    /**
     * 省市区全称
     */
    administrativeDivisionFullName!: String;
    
    /**
     * 详细地址
     */
    detailAddr!: String;
    
    /**
     * 联系人名称
     */
    contacts!: String;
    
    /**
     * 联系人性别:1男2女
     */
    contactsSex!: String;
    
    /**
     * 联系人手机号
     */
    contactsPhone!: String;
    
    /**
     * 是否是默认地址
     */
    default!: boolean;
    
}