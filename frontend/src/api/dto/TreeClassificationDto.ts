export class TreeClassificationDto {

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
     * UUID
     */
    UUID!: string;
    
    /**
     * 名称
     */
    name!: string;
    
    /**
     * 上级,为0时则为1级
     */
    parent!: string;
    
    /**
     * 排序
     */
    sort!: number;
    
    /**
     * 兄弟节点数量
     */
    breathCount!: number;
    
    /**
     * 备注
     */
    remarks!: string;
    
    /**
     * 数据分类：存储数据字典值
     */
    dataClass!: string;
    
    /**
     * 是否启用
     */
    isOpen!: boolean;
    
    /**
     * 行政区划
     */
    administrativeDivision!: string;
    
    /**
     * 行政区划名称
     */
    administrativeDivisionName!: string;
    
}