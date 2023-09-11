export class TreeClassificationDto {

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
    sort!: sring;
    
    /**
     * 兄弟节点数量
     */
    breathCount!: sring;
    
    /**
     * 备注
     */
    remarks!: string;
    
    /**
     * 数据分类：存储数据字典值
     */
    dataClass!: string;
    
}