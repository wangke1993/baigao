import { ApiProperty } from "@nestjs/swagger";
import { BaseDTO } from "src/common-dto/base.dto";
export class WalletManagementDto extends BaseDTO {

    constructor(bindUserUUID?: string, req?: any) {
        super(req);
        this.bindUserUUID = bindUserUUID;
        this.balance = 0;
        this.totalIncome = 0;
        this.totalExpenditure = 0;
    }
    @ApiProperty({
        description: 'UUID',
        required: false
    })
    UUID: string;

    @ApiProperty({
        description: '所属用户,会员UUID or 员工UUID',
        required: true
    })
    bindUserUUID: string;


    @ApiProperty({
        description: '余额（分）',
        required: false
    })
    balance: number;


    @ApiProperty({
        description: '总收入（分）',
        required: false
    })
    totalIncome: number;


    @ApiProperty({
        description: '总支出（分）',
        required: false
    })
    totalExpenditure: number;


    @ApiProperty({
        description: '备注',
        required: false
    })
    remarks: string;

    @ApiProperty({
        description: '冻结',
        required: false
    })
    freeze: boolean;

}