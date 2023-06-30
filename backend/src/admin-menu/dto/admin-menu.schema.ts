import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

@Schema()
export class AdminMenu extends Document {
    /**
     * 菜单名称：
        菜单属性：菜单/按钮
        菜单操作：路径/方法名
        权限标识：
     */

    @ApiProperty({
        description: '名称',
    })
    @Prop({
        required: true
    })
    menuName: string;
    @ApiProperty({
        description: '菜单属性：1菜单，2按钮，3数据接口',
        enum: ['menu', 'button', 'dataApi']
    })
    @Prop({
        required: true
    })
    menuType: MENU_TYPE;
    // 菜单操作
    @ApiProperty({
        required: false,
        description: '操作',
    })
    @Prop()
    menuActive: string;
    // 权限标识
    @ApiProperty({
        required: false,
        description: '权限标识',
    })
    @Prop()
    menuPowerTag: string;
    @ApiProperty({
        required: false,
        description: '菜单图标，仅一级菜单拥有',
    })
    @Prop()
    menuIcon: string;
    @ApiProperty({
        required: true,
        description: '是否显示:1显示，0不显示',
    })
    @Prop()
    isShow: string;
    // 父ID
    @ApiProperty({
        required: false,
        description: '父级Id',
    })
    @Prop()
    parentId: string;
    // 直系上级ids
    @ApiProperty({
        required: false,
        description: '直系上级ids',
    })
    @Prop()
    parentDeep: string[];
    @ApiProperty({
        required: false,
        description: '排序,升序，数值越小越靠前',
    })
    @Prop()
    sort: number;
}
export enum MENU_TYPE {
    'menu' = 1,
    'button' = 2,
    'dataApi' = 3
}
export type AdminMenuDocument = AdminMenu & Document;

export const AdminMenuSchema = SchemaFactory.createForClass(AdminMenu);