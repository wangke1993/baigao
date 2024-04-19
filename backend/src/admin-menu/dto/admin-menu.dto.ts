import { ApiProperty } from "@nestjs/swagger";
import { MENU_TYPE } from "./admin-menu.schema";

export class AdminMenuDto {
    /**
     * 菜单名称：
        菜单属性：菜单/按钮
        菜单操作：路径/方法名
        权限标识：
     */
    constructor(menuName: string, tag: string, parentId = "", parentDeep = []) {
        this.menuName = menuName;
        this.parentId = parentId;
        this.parentDeep = parentDeep;
        this.menuActive = tag;
        this.menuPowerTag = tag;
    }
    menu() {
        this.menuPowerTag = "";
        this.menuType = MENU_TYPE.menu;
        return this;
    }
    btn() {
        this.menuActive = "";
        this.menuType = MENU_TYPE.button;
        return this;
    }
    api() {
        this.menuActive = "";
        this.menuType = MENU_TYPE.dataApi;
        return this;
    }
    @ApiProperty({
        description: '名称',
    })
    menuName: string;
    @ApiProperty({
        description: '菜单属性：1菜单，2按钮，3数据接口',
        enum: ['menu', 'button', 'dataApi']
    })
    menuType: MENU_TYPE;
    // 菜单操作
    @ApiProperty({
        required: false,
        description: '操作',
    })
    menuActive: string;
    // 权限标识
    @ApiProperty({
        required: false,
        description: '权限标识',
    })
    menuPowerTag: string;
    @ApiProperty({
        required: false,
        description: '菜单图标，仅一级菜单拥有',
    })
    menuIcon: string;
    @ApiProperty({
        required: true,
        description: '是否显示:1显示，0不显示',
    })
    isShow = "1";
    // 父ID
    @ApiProperty({
        required: false,
        description: '父级Id',
    })
    parentId: string;
    // 直系上级ids
    @ApiProperty({
        required: false,
        description: '直系上级ids',
    })
    parentDeep: string[];
    @ApiProperty({
        required: false,
        description: '排序,升序，数值越小越靠前',
    })
    sort = 0;
}