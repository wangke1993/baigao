export class SystemConfigDto {

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
     * 文件id数组，只要文章上传文件，保留原有数据且把上传的文件id都push到该数组中。
     */
    fileIds?: string[];
    
    /**
     * 配置字典类型
     */
    confType?: string;
    
    /**
     * 配置选项字典值
     */
    confSelect?: string;
    
    /**
     * 配置值,DC0000为系统页面渲染配置
     */
    confValue?: string;
    
    /**
     * 是否已设置值
     */
    isSet?: boolean;
    
    /**
     * 是否允许查看,实现允许设置不允许查看
     */
    allowFetch?: boolean;
    
    /**
     * 是否公开，不用权限即可使用
     */
    isOpen?: boolean;
    
    /**
     * 备注
     */
    remarks?: string;
    
}