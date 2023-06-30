export class RolePermissionsDto {

    /**
     * 角色名称
     */
    roleName!: String;
    
    /**
     * 权限列表
     */
    permissionsList!: String[];
    
    /**
     * 角色首页
     */
    indexPath!: String;
    
    /**
     * 是否是超级管理员
     */
    isSuper!: boolean;
    
}