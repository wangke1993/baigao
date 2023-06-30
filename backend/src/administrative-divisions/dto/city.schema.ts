import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { Province } from "./province.schema";

@Schema()
export class City extends Province {

    /**
     * 行政区划：市
     * 
     */
    @ApiProperty({
        description: '所属省:code',
    })
    @Prop({
        required: true
    })
    provinceCode: string;
}
export type CityDocument = City & Document;

export const CitySchema = SchemaFactory.createForClass(City);