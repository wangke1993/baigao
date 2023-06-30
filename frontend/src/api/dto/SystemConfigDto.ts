export class SystemConfigDto {

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
     * 配置类型
     */
    confType?: String;
    
    /**
     * 配置选项
     */
    confSelect?: String;
    
    /**
     * 配置值
     */
    confValue?: String;
    
    /**
     * 是否已设置值
     */
    isSet?: boolean;
    
    /**
     * 是否允许查看
     */
    allowFetch?: boolean;
    
    /**
     * 是否对外展示
     */
    isOpen?: boolean;
    
    /**
     * 备注
     */
    remarks?: String;
    
}