export class ModuleFieldDto {

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
     * 所属模型
     */
    moduleUUID?: string;
    
    /**
     * 中文名称
     */
    name?: string;
    
    /**
     * 英文名称,单词用“-”隔开
     */
    nameEn?: string;
    
    /**
     * 类型
     */
    type?: string;
    
    /**
     * 默认值
     */
    defaultValue?: string;
    
    /**
     * 不能重复
     */
    notRepeat?: boolean;
    
    /**
     * 不能为空
     */
    notNull?: boolean;
    
    /**
     * 列表显示
     */
    listShow?: boolean;
    
    /**
     * 备注说明
     */
    description?: string;
    
    /**
     * 绑定dom,METHOD_TYPE
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
     * 树形下拉框孩子字段
     */
    dataChildField?: string;
    
}