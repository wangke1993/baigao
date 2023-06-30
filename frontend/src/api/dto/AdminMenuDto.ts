export class AdminMenuDto {

    /**
     * 名称
     */
    menuName!: String;
    
    /**
     * 菜单属性：1菜单，2按钮，3数据接口
     */
    menuType!: String;
    
    /**
     * 操作
     */
    menuActive?: String;
    
    /**
     * 权限标识
     */
    menuPowerTag?: String;
    
    /**
     * 菜单图标，仅一级菜单拥有
     */
    menuIcon?: String;
    
    /**
     * 是否显示:1显示，0不显示
     */
    isShow!: String;
    
    /**
     * 父级Id
     */
    parentId?: String;
    
    /**
     * 直系上级ids
     */
    parentDeep?: String[];
    
    /**
     * 排序,升序，数值越小越靠前
     */
    sort?: String;
    
}