import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class ModuleSearch extends BaseSchema {
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
        description: '所属字段',
        required: false
    })
    @Prop({
        required: [true, "所属字段不能为空"],
        type: String
    })
    fieldUUID: string;

    @ApiProperty({
        description: '中文名称',
        required: false
    })
    @Prop({
        required: [true, "中文名称不能为空"],
        type: String
    })
    fieldName: string;
    @ApiProperty({
        description: '英文名称,单词用“-”隔开',
        required: false
    })
    @Prop({
        required: [true, "英文名称不能为空"],
        type: String
    })
    fieldEnName: string;

    @ApiProperty({
        description: '绑定dom',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    dom: string;
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
        description: '下拉框孩子字段',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    dataChildField: string;

    @ApiProperty({
        description: '检索方式',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    method: METHOD_TYPE;
    @ApiProperty({
        description: '自动检索,值变动，就触发搜索',
        required: false
    })
    @Prop({
        required: false,
        type: Boolean
    })
    isAuto: Boolean;
}
export enum METHOD_TYPE {
    '模糊匹配' = "like",  // 仅String类型可以进行该匹配
    '包含' = "includes",
    '等于' = "=",
    '大于' = ">",
    '小于' = "<",
}

export type ModuleSearchDocument = ModuleSearch & Document;

export const ModuleSearchSchema = SchemaFactory.createForClass(ModuleSearch);