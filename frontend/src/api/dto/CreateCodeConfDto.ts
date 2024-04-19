export class CreateCodeConfDto {

    _id?: string;
    /**
     * 是否生成前端
     */
    frontend?: boolean;
    
    /**
     * 是否生成后端
     */
    backend?: boolean;
    
    /**
     * 是否生成到临时路径
     */
    isTemp?: boolean;
    
    /**
     * 生成配置
     */
    config?: any;
    
    /**
     * 后端文件配置
     */
    backendFile?: any;
    
    /**
     * 前端文件配置
     */
    frontendFile?: any;
    
}