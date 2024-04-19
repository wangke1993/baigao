export class AdminUserDto {

    _id?: string;
    /**
     * 用户名
     */
    userName!: string;
    
    /**
     * 密码
     */
    password!: string;
    
    /**
     * 角色ID数组
     */
    role!: string[];
    
    /**
     * 角色名称数组
     */
    roleName!: string[];
    
    /**
     * 备注
     */
    remarks!: string;
    
    /**
     * 用户首页，优先级高于角色首页
     */
    indexPath!: string;
    
    /**
     * 禁用
     */
    disable!: boolean;
    
    /**
     * 所属公司
     */
    companyUUID!: string;
    
    /**
     * 所属公司名称
     */
    companyName!: string;
    
}