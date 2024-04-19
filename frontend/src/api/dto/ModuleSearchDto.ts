export class ModuleSearchDto {

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
     * 所属模型
     */
    moduleUUID?: string;
    
    /**
     * 所属字段
     */
    fieldUUID?: string;
    
    /**
     * 中文名称
     */
    fieldName?: string;
    
    /**
     * 英文名称,单词用“-”隔开
     */
    fieldEnName?: string;
    
    /**
     * 英文名称,单词用“-”隔开
     */
    fieldType?: string;
    
    /**
     * 绑定dom
     */
    dom?: string;
    
    /**
     * 绑定dom数据来源
     */
    domDataUrl?: string;
    
    /**
     * 下拉框值字段
     */
    dataValueField?: string;
    
    /**
     * 下拉框标签字段
     */
    dataLabelField?: string;
    
    /**
     * 下拉框孩子字段
     */
    dataChildField?: string;
    
    /**
     * 检索方式
     */
    method?: string;
    
    /**
     * 自动检索,值变动，就触发搜索
     */
    isAuto?: boolean;
    
}