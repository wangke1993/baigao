export class ModuleConfDto {

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
     * UUID
     */
    UUID?: string;
    
    /**
     * 中文名称
     */
    name?: string;
    
    /**
     * 英文名称,单词用“-”隔开
     */
    nameEn?: string;
    
    /**
     * 挂载菜单
     */
    parentMenu?: string;
    
    /**
     * 备注
     */
    remakes?: string;
    
}