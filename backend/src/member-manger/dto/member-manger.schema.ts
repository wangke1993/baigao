import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";
import { DC0008 } from "src/system-config/dto/system-config.schema";

@Schema()
export class MemberManger extends BaseSchema {

    /**
     * 会员管理模型
     * 
     */
    @ApiProperty({
        description: '用户名称',
    })
    @Prop({
        required: true
    })
    userName: string;
    @ApiProperty({
        description: '用户头像',
    })
    @Prop({
        required: true
    })
    avatar: string;
    @ApiProperty({
        description: '用户UUID',
    })
    @Prop({
        required: true
    })
    UUID: string;
    @ApiProperty({
        description: 'openId',
    })
    @Prop({
        required: true
    })
    openId: string;
    @ApiProperty({
        description: '会员二维码',
    })
    @Prop()
    memberQR: string;
    @ApiProperty({
        description: '性别：1男，2女，0未知',
    })
    @Prop({
        required: true
    })
    sex: number;
    @ApiProperty({
        description: '年龄',
    })
    @Prop()
    age: number;
    @ApiProperty({
        description: '电话号码',
    })
    @Prop()
    phoneNumber: string;
    @ApiProperty({
        description: '用户角色',
    })
    @Prop({
        required: true
    })
    role: string[];
    @ApiProperty({
        description: '会员等级（分销等级）',
    })
    @Prop({
        required: true
    })
    rank: DC0008;
}
export type MemberMangerDocument = MemberManger & Document;

export const MemberMangerSchema = SchemaFactory.createForClass(MemberManger);