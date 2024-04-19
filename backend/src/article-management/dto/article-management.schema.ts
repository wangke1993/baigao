import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class ArticleManagement extends BaseSchema {

    /**
     * 数据字典模型
     * 
     */
    @ApiProperty({
        description: '文章名称',
    })
    @Prop({
        required: true
    })
    articleName: string;
    @ApiProperty({
        description: '封面',
    })
    @Prop()
    cover: string;
    @ApiProperty({
        description: '所属分类，取字典管理中：DC0001的值'
    })
    @Prop({
        required: true
    })
    articleClass: string;
    @ApiProperty({
        description: '文章概要',
    })
    @Prop()
    syn: string;
    @ApiProperty({
        description: '文章内容',
    })
    @Prop()
    content: string;
    @ApiProperty({
        required: false,
        description: '是否发布',
    })
    @Prop()
    release: boolean;

    @ApiProperty({
        required: false,
        description: '预招标公告报名用户',
    })
    @Prop()
    signUpUsers: String[];
    @ApiProperty({
        required: false,
        description: '有效期，不填则永久有效',
    })
    @Prop()
    expirationDate: Date;
}
export type ArticleManagementDocument = ArticleManagement & Document;

export const ArticleManagementSchema = SchemaFactory.createForClass(ArticleManagement);