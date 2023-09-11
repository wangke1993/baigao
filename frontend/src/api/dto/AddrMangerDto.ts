export class AddrMangerDto {

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
     * 文件id数组，只要文章上传文件，保留原有数据且把上传的文件id都push到该数组中。
     */
    fileIds?: string[];
    
    /**
     * 所属会员
     */
    memberUUID!: string;
    
    /**
     * 省
     */
    province!: string;
    
    /**
     * 市
     */
    city!: string;
    
    /**
     * 区
     */
    area!: string;
    
    /**
     * 省市区全称
     */
    administrativeDivisionFullName!: string;
    
    /**
     * 详细地址
     */
    detailAddr!: string;
    
    /**
     * 联系人名称
     */
    contacts!: string;
    
    /**
     * 联系人性别:1男2女
     */
    contactsSex!: string;
    
    /**
     * 联系人手机号
     */
    contactsPhone!: string;
    
    /**
     * 是否是默认地址
     */
    default!: boolean;
    
}