import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

@Schema()
export class AdminUser extends Document {
    /**
     * 后台用户管理
     */
    @ApiProperty({
        description:"用户名"
    })
    @Prop({
        required: true
    })
    userName: string;
    @ApiProperty({
        description:"密码"
    })
    @Prop({
        required: true
    })
    password: string;
    @ApiProperty({
        description:"角色ID数组"
    })
    @Prop({
        required: true
    })
    role: string[];
    @ApiProperty({
        description:"角色名称数组"
    })
    @Prop({
        required: true
    })
    roleName: string[];
    @ApiProperty({
        description:"备注"
    })
    @Prop()
    remarks: string;
    @ApiProperty({
        description:"用户首页，优先级高于角色首页"
    })
    @Prop()
    indexPath: string;
}
export type AdminUserDocument = AdminUser & Document;

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);