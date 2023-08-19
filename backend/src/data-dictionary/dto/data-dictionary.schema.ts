import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

@Schema()
export class DataDictionary extends Document {

    /**
     * 数据字典模型
     * 
     */
    @ApiProperty({
        description: '名称',
    })
    @Prop({
        required: true
    })
    dicName: string;
    @ApiProperty({
        description: '分类：1字典分类，2字典值'
    })
    @Prop({
        required: true
    })
    dicType: DIC_TYPE;
    @ApiProperty({
        required: false,
        description: '所属分类Code,仅字典值有',
    })
    @Prop()
    dicClass: string;
    // 编码
    @ApiProperty({
        required: false,
        description: '编码：分类(DC0001),值(DC00010001);根据最后添加的一条数据自增',
    })
    @Prop()
    dicCode: string;
    @ApiProperty({
        required: false,
        description: '备注',
    })
    @Prop()
    remarks: string;
    @ApiProperty({
        required: false,
        description: '添加时间',
    })
    @Prop()
    addDate: Date;
    @ApiProperty({
        required: false,
        description: '系统值标识，系统值不能被删除',
    })
    @Prop()
    isSystem: boolean;

    /**
     * TODO：新增字段，实现自定义配置功能
     * 配置值：
     * 是否设置：
     * 保密：开关，是否展示值
     * 值dom配置：单行文本，文本域，单选下拉框，多选下拉框，开关，文件
     */
}
export enum DIC_TYPE {
    'class' = 1,
    'value' = 2
}
export type DataDictionaryDocument = DataDictionary & Document;

export const DataDictionarySchema = SchemaFactory.createForClass(DataDictionary);