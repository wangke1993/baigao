import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

@Schema()
export class Province extends Document {
    /**
     * 行政区划：省
     * 
     */

    @ApiProperty({
        description: '行政区划编码: 110101,省11,市01,区01'
    })
    @Prop({
        required: true
    })
    code: string;


    @ApiProperty({
        description: '名称',
    })
    @Prop({
        required: true
    })
    name: string;
}
export enum AREA_TYPE {
    'province' = 1,
    'city' = 2,
    'area' = 3
}
export type ProvinceDocument = Province & Document;

export const ProvinceSchema = SchemaFactory.createForClass(Province);