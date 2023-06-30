import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { City } from "./city.schema";

@Schema()
export class Area extends City {

    /**
     * 行政区划：区
     * 
     */
    @ApiProperty({
        description: '所属市:code',
    })
    @Prop({
        required: true
    })
    cityCode: string;
}
export type AreaDocument = Area & Document;

export const AreaSchema = SchemaFactory.createForClass(Area);