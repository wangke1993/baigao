import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class TreeClassification extends BaseSchema {

    @ApiProperty({
        description: 'UUID',
    })
    @Prop({
        required: true
    })
    UUID: string;
    
    @ApiProperty({
        description: '名称',
    })
    @Prop({
        required: true
    })
    name: string;

    @ApiProperty({
        description: '上级,为0时则为1级',
    })
    @Prop({
        required: true
    })
    parent: string;

    @ApiProperty({
        description: '排序',
    })
    @Prop({
        required: true
    })
    sort: number;
    @ApiProperty({
        description: '兄弟节点数量',
    })
    @Prop({
        required: true
    })
    breathCount: number;

    @ApiProperty({
        description: '备注',
    })
    @Prop()
    remarks: String;
    @ApiProperty({
        description: '数据分类：存储数据字典值',
    })
    @Prop({
        required: true
    })
    dataClass: String;
    @ApiProperty({
        description: '是否启用',
    })
    @Prop({
        default: false
    })
    isOpen: Boolean;
    @ApiProperty({
        description: '行政区划',
    })
    @Prop()
    administrativeDivision: String;
    @ApiProperty({
        description: '行政区划名称',
    })
    @Prop()
    administrativeDivisionName: String;

}
export type TreeClassificationDocument = TreeClassification & Document;

export const TreeClassificationSchema = SchemaFactory.createForClass(TreeClassification);