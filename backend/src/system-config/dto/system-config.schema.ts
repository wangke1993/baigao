import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class SystemConfig extends BaseSchema {

    @ApiProperty({
        description: '配置类型',
        required: false
    })
    @Prop({
        required: false
    })
    confType: CONF_TYPE;
    @ApiProperty({
        description: '配置选项',
        required: false
    })
    @Prop({
        required: true
    })
    confSelect:  DC0003 | DC0008 | DC0005;
    @ApiProperty({
        description: '配置值',
        required: false
    })
    @Prop({
        required: false
    })
    confValue: string;
    @ApiProperty({
        description: '是否已设置值',
        required: false
    })
    @Prop({
        required: false
    })
    isSet: boolean;
    @ApiProperty({
        description: '是否允许查看',
        required: false
    })
    @Prop({
        required: false
    })
    allowFetch: boolean;
    @ApiProperty({
        description: '是否对外展示',
        required: false
    })
    @Prop({
        required: false
    })
    isOpen: boolean;
    @ApiProperty({
        description: '备注',
        required: false
    })
    @Prop({
        required: false
    })
    remarks: string;
}

export enum CONF_TYPE {
    '短信参数设置' = 'DC0003',
    '小程序参数设置' = 'DC0004',
    '支付参数设置' = 'DC0005',
}
export enum DC0003 {
    '短信API密钥' = 'DC00030001',
    '短信签名' = 'DC00030002',
    '是否启用短信' = 'DC00030003',
}

export enum DC0004 {
    'appID' = 'DC00040001',
    'appSecret' = 'DC00040002',
}
export enum DC0005 {
    '应用ID' = 'DC00050001',
    '商户号' = 'DC00050002',
    '公钥' = 'DC00050003',
    '私钥' = 'DC00050004',
    '支付回调地址' = 'DC00050005',
    '退款回调地址' = 'DC00050006',
    'APIv3密钥' = 'DC00050007',
}
export enum DC0008{
    "游客" = "DC00080001",
}
export type SystemConfigDocument = SystemConfig & Document;

export const SystemConfigSchema = SchemaFactory.createForClass(SystemConfig);