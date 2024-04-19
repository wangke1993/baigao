import { ApiProperty } from "@nestjs/swagger";
import { BaseDTO } from "src/common-dto/base.dto";
export class WalletLogDto extends BaseDTO {

    constructor(
        walletUUID?: string,
        amount?: number,
        balance?: number,
        req?: any
    ) {
        super(req);
        this.walletUUID = walletUUID;
        this.amount = amount;
        this.balance = balance;
    }
    /**
     * 收入
     * @returns this
     */
    income() {
        this.logType = '1';
        this.logTypeText = "收入";
        return this;
    }
    /**
     * 支出
     * @returns this
     */
    expenditure() {
        this.logType = '-1'
        this.logTypeText = "支出";
        return this;
    }
    @ApiProperty({
        description: '所属钱包',
        required: true
    })
    walletUUID: string;


    @ApiProperty({
        description: '金额（分）',
        required: true
    })
    amount: number;


    @ApiProperty({
        description: '余额',
        required: true
    })
    balance: number;


    @ApiProperty({
        description: '类型',
        required: true
    })
    logType: string;

    @ApiProperty({
        description: '类型名称',
        required: true
    })
    logTypeText: string;


    @ApiProperty({
        description: '备注',
        required: false
    })
    remarks: string;
    @ApiProperty({
        description: '是否退款',
        required: false
    })
    refunded: Boolean;

    @ApiProperty({
        description: '是否生效',
        required: false
    })
    takeEffect: Boolean;
}