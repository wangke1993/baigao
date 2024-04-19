import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class WxMpUser extends BaseSchema {


    /**
     * 是否关注公众号 1关注，0没关注
     */
    @ApiProperty({
        description: 'subscribe',
        required: true
    })
    @Prop({
        required: [true, "关注标识(subscribe)不能为空"],
        type: Number,
        default: 1
    })
    subscribe: number;
    /**
    * openid
    */
    @ApiProperty({
        description: 'openid',
        required: true
    })
    @Prop({
        required: [true, "openid(openid)不能为空"],
        unique: true,
        type: String
    })
    openid: string;


    /**
    * 关注时间
    */
    @ApiProperty({
        description: '关注时间',
        required: false
    })
    @Prop({
        required: false,
        type: Number
    })
    subscribe_time: number;


    /**
    * unionid
    */
    @ApiProperty({
        description: 'unionid',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    unionid: string;


    /**
    * 备注
    */
    @ApiProperty({
        description: '备注',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    remark: string;


    /**
    * groupid
    */
    @ApiProperty({
        description: 'groupid',
        required: false
    })
    @Prop({
        required: false,
        type: Number
    })
    groupid: number;


    /**
    * 标签ID列表
    */
    @ApiProperty({
        description: '标签ID列表',
        required: false
    })
    @Prop({
        required: false,
        type: Array<Number>
    })
    tagid_list: number[];


    /**
    * 用户来源
    */
    @ApiProperty({
        description: '用户来源',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    subscribe_scene: string;

    /**
    * 用户来源说明
    */
    @ApiProperty({
        description: '用户来源说明',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    subscribe_scene_text: string;


    /**
    * 二维码场景
    */
    @ApiProperty({
        description: '二维码场景',
        required: false
    })
    @Prop({
        required: false,
        type: Number
    })
    qr_scene: number;


    /**
    * 二维码场景描述
    */
    @ApiProperty({
        description: '二维码场景描述',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    qr_scene_str: string;


}

export type WxMpUserDocument = WxMpUser & Document;

export const WxMpUserSchema = SchemaFactory.createForClass(WxMpUser);