export class AdminMenuDto {

    _id?: string;
    /**
     * 名称
     */
    menuName!: string;
    
    /**
     * 菜单属性：1菜单，2按钮，3数据接口
     */
    menuType!: string;
    
    /**
     * 操作
     */
    menuActive?: string;
    
    /**
     * 权限标识
     */
    menuPowerTag?: string;
    
    /**
     * 菜单图标，仅一级菜单拥有
     */
    menuIcon?: string;
    
    /**
     * 是否显示:1显示，0不显示
     */
    isShow!: string;
    
    /**
     * 父级Id
     */
    parentId?: string;
    
    /**
     * 直系上级ids
     */
    parentDeep?: string[];
    
    /**
     * 排序,升序，数值越小越靠前
     */
    sort?: string;
    
}