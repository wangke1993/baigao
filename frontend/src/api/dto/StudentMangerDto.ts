export class StudentMangerDto {

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
    UUID!: string;
    
    
    /**
     * 名字
     */
     name!: string;
    
    /**
     * 年龄
     */
     age?: string;
    
}