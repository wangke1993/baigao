import { ApiProperty } from "@nestjs/swagger";
import { AdminMenu } from "./admin-menu.schema";

export class AdminMenuTreeDto {
    constructor(adminMenu: AdminMenu) {
        this._id = adminMenu._id;
        this.menuActive = adminMenu.menuActive;
        this.menuName = adminMenu.menuName;
        this.menuPowerTag = adminMenu.menuPowerTag;
        this.menuType = adminMenu.menuType;
        this.parentDeep = adminMenu.parentDeep;
        this.menuIcon = adminMenu.menuIcon;
        this.isShow = adminMenu.isShow;
        this.sort = adminMenu.sort;
        this.parentId = adminMenu.parentId;
    }

    @ApiProperty({
        description: "子菜单"
    })
    children: AdminMenuTreeDto[]
    @ApiProperty({
        description: "菜单id"
    })
    _id: string
    /**
     * 菜单名称：
        菜单属性：菜单/按钮
        菜单操作：路径/方法名
        权限标识：
     */

    @ApiProperty({
        description: '名称',
    })
    menuName: string;
    @ApiProperty({
        description: '菜单属性',
        type: Number
    })
    menuType: number;
    // 菜单操作
    @ApiProperty({
        required: false,
        description: '操作',
        type: String
    })
    menuActive: string;
    // 权限标识
    @ApiProperty({
        required: false,
        description: '权限标识',
        type: String
    })
    menuPowerTag: string;
    // 父ID
    @ApiProperty({
        required: false,
        description: '父级Id',
        type: String
    })
    parentId: string;
    @ApiProperty({
        required: false,
        description: '直系上级ids',
    })
    parentDeep: string[];
    @ApiProperty({
        required: false,
        description: '菜单图标，仅一级菜单拥有',
    })
    menuIcon: string;
    @ApiProperty({
        required: true,
        description: '是否显示:1显示，0不显示',
    })
    isShow: string;
    @ApiProperty({
        required: true,
        description: '排序，升序，序号越小越靠前',
    })
    sort: number;
    @ApiProperty({
        required: true,
        description: '是否禁用',
    })
    disabled = false;
}