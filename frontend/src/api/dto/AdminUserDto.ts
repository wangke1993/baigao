export class AdminUserDto {

    /**
     * 用户名
     */
    userName!: String;
    
    /**
     * 密码
     */
    password!: String;
    
    /**
     * 角色ID数组
     */
    role!: String[];
    
    /**
     * 角色名称数组
     */
    roleName!: String[];
    
    /**
     * 备注
     */
    remarks!: String;
    
    /**
     * 用户首页，优先级高于角色首页
     */
    indexPath!: String;
    
}