import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class MemberManagement extends BaseSchema {

    /**
     * 会员管理模型
     * 
     */
    @ApiProperty({
        description: '用户名称',
    })
    @Prop()
    userName: string;

    @ApiProperty({
        description: '用户头像',
    })
    @Prop()
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

    /**
     * UnionID
     */
    @ApiProperty({
        description: 'UnionID',
    })
    @Prop()
    unionID: string;

    @ApiProperty({
        description: '会员二维码',
    })
    @Prop()
    memberQR: string;
    @ApiProperty({
        description: '性别：1男，2女，0未知',
    })
    @Prop()
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
        description: '会员等级',
    })
    @Prop({
        required: true
    })
    rank: String;
    @ApiProperty({
        description: '会员等级名称',
    })
    @Prop()
    rankText: String;

    @ApiProperty({
        description: '用户socket连接的id,不为空则在线，为空则不在线',
    })
    @Prop()
    socketId: String;
}
export type MemberManagementDocument = MemberManagement & Document;

export const MemberManagementSchema = SchemaFactory.createForClass(MemberManagement);