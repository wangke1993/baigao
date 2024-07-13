import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

@Schema()
export class RolePermissions extends Document {
    /**
     * 角色权限：
        角色名称：
        权限列表：objectID[]
     */

    @ApiProperty({
        description: '角色名称',
    })
    @Prop({
        required: true
    })
    roleName: string;
    @ApiProperty({
        description: '权限列表',
    })
    @Prop({
        required: false
    })
    permissionsList: string[];

    @ApiProperty({
        description: '隐藏显示菜单',
    })
    @Prop({
        required: false
    })
    hidePermissionsList: string[];

    @ApiProperty({
        description: "角色首页"
    })
    @Prop()
    indexPath: string;
    @ApiProperty({
        description: "是否是超级管理员"
    })
    @Prop()
    isSuper: boolean;
}
export type RolePermissionsDocument = RolePermissions & Document;

export const RolePermissionsSchema = SchemaFactory.createForClass(RolePermissions);