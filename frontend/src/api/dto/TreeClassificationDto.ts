export class TreeClassificationDto {

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
     * UUID
     */
    UUID!: String;
    
    /**
     * 名称
     */
    name!: String;
    
    /**
     * 上级,为0时则为1级
     */
    parent!: String;
    
    /**
     * 排序
     */
    sort!: String;
    
    /**
     * 兄弟节点数量
     */
    breathCount!: String;
    
    /**
     * 备注
     */
    remarks!: String;
    
    /**
     * 数据分类：存储数据字典值
     */
    dataClass!: String;
    
}