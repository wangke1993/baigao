import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class WalletManagement extends BaseSchema {

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
        description: '所属用户,会员UUID or 员工UUID',
        required: true
    })
    @Prop({
        required: [true, "所属用户(bindUserUUID)不能为空"],
        type: String
    })
    bindUserUUID: string;


    @ApiProperty({
        description: '余额（分）',
        required: false
    })
    @Prop({
        required: false,
        default: 0,
        type: Number
    })
    balance: number;


    @ApiProperty({
        description: '总收入（分）',
        required: false
    })
    @Prop({
        required: false,
        default: 0,
        type: Number
    })
    totalIncome: number;


    @ApiProperty({
        description: '总支出（分）',
        required: false
    })
    @Prop({
        required: false,
        default: 0,
        type: Number
    })
    totalExpenditure: number;


    @ApiProperty({
        description: '备注',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    remarks: string;

    @ApiProperty({
        description: '冻结',
        required: false
    })
    @Prop({
        required: false,
        default: false,
        type: Boolean
    })
    freeze: boolean;
    
}

export type WalletManagementDocument = WalletManagement & Document;

export const WalletManagementSchema = SchemaFactory.createForClass(WalletManagement);