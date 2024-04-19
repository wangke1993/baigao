import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class MemberAddress extends BaseSchema {
    
    
    @ApiProperty({
        description: '所属会员',
        required: true
    })
    @Prop({
        required: [true,"所属会员(memberUUID)不能为空"],
        type: String
    })
    memberUUID: string;
    
    
    @ApiProperty({
        description: '行政区划',
        required: true
    })
    @Prop({
        required: [true,"行政区划(administrativeDivision)不能为空"],
        type: String
    })
    administrativeDivision: string;
    
    @ApiProperty({
        description: '行政区划名称',
        required: true
    })
    @Prop({
        required: [true,"行政区划名称(administrativeDivisionText)不能为空"],
        type: String
    })
    administrativeDivisionText: string;
    
    
    @ApiProperty({
        description: '详细地址',
        required: true
    })
    @Prop({
        required: [true,"详细地址(address)不能为空"],
        type: String
    })
    address: string;
    
    
    @ApiProperty({
        description: '联系人',
        required: true
    })
    @Prop({
        required: [true,"联系人(contacts)不能为空"],
        type: String
    })
    contacts: string;
    
    
    @ApiProperty({
        description: '联系电话',
        required: true
    })
    @Prop({
        required: [true,"联系电话(contactsPhone)不能为空"],
        type: String
    })
    contactsPhone: string;
    
    
}

export type MemberAddressDocument = MemberAddress & Document;

export const MemberAddressSchema = SchemaFactory.createForClass(MemberAddress);