export class RolePermissionsDto {

    /**
     * 角色名称
     */
    roleName!: string;
    
    /**
     * 权限列表
     */
    permissionsList!: string[];
    
    /**
     * 角色首页
     */
    indexPath!: string;
    
    /**
     * 是否是超级管理员
     */
    isSuper!: boolean;
    
}