import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class ModuleField extends BaseSchema {
    @ApiProperty({
        description: 'UUID',
        required: false
    })
    @Prop({
        required: true,
        type: String
    })
    UUID: string;

    @ApiProperty({
        description: '所属模型',
        required: false
    })
    @Prop({
        required: [true, "所属模型不能为空"],
        type: String
    })
    moduleUUID: string;

    @ApiProperty({
        description: '中文名称',
        required: false
    })
    @Prop({
        required: [true, "中文名称不能为空"],
        type: String
    })
    name: string;

    @ApiProperty({
        description: '英文名称,单词用“-”隔开',
        required: false
    })
    @Prop({
        required: [true, "英文名称不能为空"],
        type: String
    })
    nameEn: string;

    @ApiProperty({
        description: '类型',
        required: false
    })
    @Prop({
        required: [true, "数据类型不能为空"],
        type: String
    })
    type: string;

    @ApiProperty({
        description: '默认值',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    defaultValue: string;

    @ApiProperty({
        description: '不能重复',
        required: false
    })
    @Prop({
        required: false,
        type: Boolean,
        default: false,
    })
    notRepeat: Boolean;
    @ApiProperty({
        description: '不能为空',
        required: false,
    })
    @Prop({
        required: false,
        type: Boolean,
        default: false,
    })
    notNull: Boolean;

    @ApiProperty({
        description: '列表显示',
        required: false
    })
    @Prop({
        required: false,
        type: Boolean,
        default: false,
    })
    listShow: Boolean;

    @ApiProperty({
        description: '备注说明',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    description: string;

    @ApiProperty({
        description: '绑定dom,METHOD_TYPE',
        required: false
    })
    @Prop({
        required: [true, "绑定dom不能为空"],
        type: String
    })
    dom: METHOD_TYPE;

    @ApiProperty({
        description: '绑定dom数据来源',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    domDataUrl: string;
    @ApiProperty({
        description: '下拉框值字段',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    dataValueField: string;
    @ApiProperty({
        description: '下拉框标签字段',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    dataLabelField: string;
    @ApiProperty({
        description: '树形下拉框孩子字段',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    dataChildField: string;


}
export enum METHOD_TYPE {
    '单行文本' = 'Input',
    '密码' = 'Password',
    '多行' = 'Area',
    '开关' = 'Swatch',
    '单选下拉' = 'Select',
    '多选下拉' = 'MoreSelect',
    '级联单选下拉' = 'TreeSelect',
    '级联多选下拉' = 'MoreTreeSelect',
    '富文本' = 'MoreText',
    '附件' = 'File',
    '图片' = 'Image',
    '视频' = 'Vide',
    '音频' = 'Audio',
}

export type ModuleFieldDocument = ModuleField & Document;

export const ModuleFieldSchema = SchemaFactory.createForClass(ModuleField);