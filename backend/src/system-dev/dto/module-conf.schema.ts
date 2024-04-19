import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class ModuleConf extends BaseSchema {

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
        description: '挂载菜单',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    parentMenu: string;

    @ApiProperty({
        description: '备注',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    remakes: string;
    @ApiProperty({
        description: '生成次数',
        required: false
    })
    @Prop({
        required: false,
        default: 0,
        type: Number
    })
    createCount: number;
}

export type ModuleConfDocument = ModuleConf & Document;

export const ModuleConfSchema = SchemaFactory.createForClass(ModuleConf);