export class ArticleManagementDto {

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
     * 文章名称
     */
    articleName!: string;
    
    /**
     * 封面
     */
    cover!: string;
    
    /**
     * 所属分类，取字典管理中：DC0001的值
     */
    articleClass!: string;
    
    /**
     * 文章概要
     */
    syn!: string;
    
    /**
     * 文章内容
     */
    content!: string;
    
    /**
     * 是否发布
     */
    release?: boolean;
    
    /**
     * 预招标公告报名用户
     */
    signUpUsers?: string[];
    
    /**
     * 有效期，不填则永久有效
     */
    expirationDate?: string;
    
}