import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';
import { BaseSchema } from "src/common-dto/base.schema";

@Schema()
export class WithdrawalManagement extends BaseSchema {
    
    @ApiProperty({
        description: '提现钱包',
        required: true
    })
    @Prop({
        required: [true,"提现钱包(walletUUID)不能为空"],
        type: String
    })
    walletUUID: string;

    @ApiProperty({
        description: '提现钱包绑定用户',
        required: true
    })
    @Prop({
        required: [true,"提现钱包绑定用户(walletBindUserUUID)不能为空"],
        type: String
    })
    walletBindUserUUID: string;
    
    @ApiProperty({
        description: '提现用户',
        required: true
    })
    @Prop({
        required: [true,"提现用户(memberUUID)不能为空"],
        type: String
    })
    memberUUID: string;

    @ApiProperty({
        description: '绑定用户openId',
        required: true
    })
    @Prop({
        required: [true,"绑定用户openId(openId)不能为空"],
        type: String
    })
    openId: string;

    /**
     * 用户快照，员工提现存储员工真实姓名，用户提现存储昵称
     */
    @ApiProperty({
        description: '用户快照',
        required: true
    })
    @Prop({
        required: [true,"用户快照(userSnapshot)不能为空"],
        type: String
    })
    userSnapshot: string;
    
    
    @ApiProperty({
        description: '提现金额（分）',
        required: true
    })
    @Prop({
        required: [true,"提现金额（分）(amount)不能为空"],
        type: Number
    })
    amount: number;
    
    @ApiProperty({
        description: '提现单号',
        required: true
    })
    @Prop({
        type: String
    })
    withdrawalNo: string;
    
    @ApiProperty({
        description: '提现结果记录',
        required: true
    })
    @Prop({
        type: String
    })
    withdrawalResult: string;
    @ApiProperty({
        description: '提现类型',
        required: true
    })
    @Prop({
        required: [true,"提现类型(withdrawal)不能为空"],
        type: String
    })
    withdrawal: string;
    
    @ApiProperty({
        description: '提现类型名称',
        required: true
    })
    @Prop({
        required: [true,"提现类型名称(withdrawalText)不能为空"],
        type: String
    })
    withdrawalText: string;
    
    
    @ApiProperty({
        description: '审核状态',
        required: true
    })
    @Prop({
        required: [true,"审核状态(status)不能为空"],
        default: 0,
        type: String
    })
    status: string;
    
    @ApiProperty({
        description: '审核状态名称',
        required: true
    })
    @Prop({
        required: [true,"审核状态名称(statusText)不能为空"],
        type: String
    })
    statusText: string;
    
    
    @ApiProperty({
        description: '拒绝原因',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    rejectReason: string;
    
    
    @ApiProperty({
        description: '审核人',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    reviewedBy: string;
    
    
    @ApiProperty({
        description: '审核人校验方式',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    reviewedCheckType: string;
    
    @ApiProperty({
        description: '审核人校验方式名称',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    reviewedCheckTypeText: string;
    
    
    @ApiProperty({
        description: '审核人校验信息',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    reviewerVerificationMethod: string;
    
    
    @ApiProperty({
        description: '审核通过时间',
        required: false
    })
    @Prop({
        required: false,
        type: Date
    })
    passDate: Date;
    
    
    @ApiProperty({
        description: '备注',
        required: false
    })
    @Prop({
        required: false,
        type: String
    })
    remarks: string;
    
    
}

export type WithdrawalManagementDocument = WithdrawalManagement & Document;

export const WithdrawalManagementSchema = SchemaFactory.createForClass(WithdrawalManagement);