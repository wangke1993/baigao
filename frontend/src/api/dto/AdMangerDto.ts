export class AdMangerDto {

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
     * 广告名称
     */
    name!: string;
    
    /**
     * 广告图片
     */
    photo!: string;
    
    /**
     * 备注
     */
    remarks!: string;
    
    /**
     * 链接类型:1商品,2文章,3自定义URL
     */
    linkType!: string;
    
    /**
     * 链接值:类型为1,2时,这里为文章或商品的id(弹窗选择);为3时则是http路径
     */
    linkValue!: string;
    
    /**
     * 链接名称
     */
    linkName!: string;
    
    /**
     * 广告位置:数据字典DC0002的字典值
     */
    position!: string;
    
    /**
     * 是否发布
     */
    release?: boolean;
    
    /**
     * 排序,升序,越小越靠前
     */
    sort?: sring;
    
}