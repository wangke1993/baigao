export class ArticleMangerDto {

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
     * 文章名称
     */
    articleName!: String;
    
    /**
     * 封面
     */
    cover!: String;
    
    /**
     * 所属分类，取字典管理中：DC0001的值
     */
    articleClass!: String;
    
    /**
     * 文章概要
     */
    syn!: String;
    
    /**
     * 文章内容
     */
    content!: String;
    
    /**
     * 是否发布
     */
    release?: boolean;
    
    /**
     * 预招标公告报名用户
     */
    signUpUsers?: String[];
    
    /**
     * 有效期，不填则永久有效
     */
    expirationDate?: String;
    
}