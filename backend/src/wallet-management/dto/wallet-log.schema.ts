import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class WalletLog extends BaseSchema {


    @ApiProperty({
        description: '所属钱包',
        required: true
    })
    @Prop({
        required: [true, "所属钱包(walletUUID)不能为空"],
        type: String
    })
    walletUUID: string;


    @ApiProperty({
        description: '金额（分）',
        required: true
    })
    @Prop({
        required: [true, "金额（分）(amount)不能为空"],
        type: Number
    })
    amount: number;


    @ApiProperty({
        description: '余额',
        required: true
    })
    @Prop({
        required: [true, "余额(balance)不能为空"],
        type: String
    })
    balance: number;


    @ApiProperty({
        description: '类型',
        required: true
    })
    @Prop({
        required: [true, "类型(logType)不能为空"],
        type: String
    })
    logType: string;

    @ApiProperty({
        description: '类型名称',
        required: true
    })
    @Prop({
        required: [true, "类型名称(logTypeText)不能为空"],
        type: String
    })
    logTypeText: string;


    @ApiProperty({
        description: '备注',
        required: true
    })
    @Prop({
        required: [true, "备注(remarks)不能为空"],
        type: String
    })
    remarks: string;

    @ApiProperty({
        description: '是否退款',
        required: true
    })
    @Prop({
        type: Boolean,
        default: false
    })
    refunded: Boolean;

    @ApiProperty({
        description: '是否生效',
        required: true
    })
    @Prop({
        type: Boolean,
        default: true
    })
    takeEffect: Boolean;

}

export type WalletLogDocument = WalletLog & Document;

export const WalletLogSchema = SchemaFactory.createForClass(WalletLog);