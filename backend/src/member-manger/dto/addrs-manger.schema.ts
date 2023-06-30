import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class AddrManger extends BaseSchema {

    /**
     * 会员地址管理模型
     * 
     */
    @ApiProperty({
        description: '所属会员',
    })
    @Prop({
        required: true
    })
    memberUUID: string;
    @ApiProperty({
        description: '省',
    })
    @Prop({
        required: true
    })
    province: string;
    @ApiProperty({
        description: '市',
    })
    @Prop({
        required: true
    })
    city: string;
    @ApiProperty({
        description: '区',
    })
    @Prop({
        required: true
    })
    area: string;
    @ApiProperty({
        description: '省市区全称',
    })
    @Prop({
        required: true
    })
    administrativeDivisionFullName: string;
    @ApiProperty({
        description: '详细地址',
    })
    @Prop({
        required: true
    })
    detailAddr: string;
    @ApiProperty({
        description: '联系人名称',
    })
    @Prop({
        required: true
    })
    contacts: string;
    @ApiProperty({
        description: '联系人性别:1男2女',
    })
    @Prop({
        required: true
    })
    contactsSex: string;
    @ApiProperty({
        description: '联系人手机号',
    })
    @Prop({
        required: true
    })
    contactsPhone: string;
    @ApiProperty({
        description: '是否是默认地址',
    })
    @Prop({
        required: true
    })
    default: false;
}
export type AddrMangerDocument = AddrManger & Document;

export const AddrMangerSchema = SchemaFactory.createForClass(AddrManger);