import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class AdManagement extends BaseSchema {

    /**
     * 数据字典模型
     * 
     */
    @ApiProperty({
        description: '广告名称',
    })
    @Prop({
        required: true
    })
    name: string;

    @ApiProperty({
        description: '广告图片',
    })
    @Prop({
        required: true
    })
    photo: string;

    @ApiProperty({
        description: '备注',
    })
    @Prop({
        required: false
    })
    remarks: string;
    @ApiProperty({
        description: '链接类型:1商品,2文章,3自定义URL',
    })
    @Prop({
        required: false
    })
    linkType: string;
    @ApiProperty({
        description: '链接值:类型为1,2时,这里为文章或商品的id(弹窗选择);为3时则是http路径',
    })
    @Prop({
        required: false
    })
    linkValue: string;
    @ApiProperty({
        description: '链接名称',
    })
    @Prop({
        required: false
    })
    linkName: string;
    @ApiProperty({
        description: '广告位置:数据字典DC0002的字典值',
    })
    @Prop({
        required: false
    })
    position: string;
    @ApiProperty({
        required: false,
        description: '是否发布',
    })
    @Prop()
    release: boolean;
    @ApiProperty({
        required: false,
        description: '排序,升序,越小越靠前',
    })
    @Prop()
    sort: number;
}

export type AdManagementDocument = AdManagement & Document;

export const AdManagementSchema = SchemaFactory.createForClass(AdManagement);