import { ApiProperty } from "@nestjs/swagger";
import { BaseDTO } from "src/common-dto/base.dto";
import { DC0012, DC0013 } from "src/data-dictionary/dic-enum";
import { WalletManagement } from "src/wallet-management/dto/wallet-management.schema";

/**
 * 提现模型
 */
export class WithdrawalManagementDto extends BaseDTO {

    constructor(userPort: String, amount: Number, req: any) {
        super(req);
        this.withdrawal = DC0012.会员提现;
        this.withdrawalText = "会员提现";
        this.remarks = '提现到微信';
        this.amount = Number(amount);
        this.memberUUID = req.user.UUID;
        this.openId = req.user.openId;
        this.status = DC0013.待审核;
        this.statusText = '待审核';
    }

    /**
     * 关联钱包
     */
    linkWallet(wallet: WalletManagement) {
        if (!wallet) {
            throw new Error("钱包不存在");
        }
        this.walletUUID = wallet.UUID;
        this.walletBindUserUUID = wallet.bindUserUUID;
        if (wallet.balance < this.amount) {
            throw new Error("余额不足");
        }
        return this;
    }

    @ApiProperty({
        description: '提现用户',
        required: true
    })
    memberUUID: string;

    @ApiProperty({
        description: '绑定用户openId',
        required: true
    })
    openId: string;

    @ApiProperty({
        description: '用户快照',
        required: true
    })
    userSnapshot: string;

    @ApiProperty({
        description: '提现钱包',
        required: true
    })
    walletUUID: string;

    @ApiProperty({
        description: '提现钱包绑定用户',
        required: true
    })
    walletBindUserUUID: string;


    @ApiProperty({
        description: '提现金额（分）',
        required: true
    })
    amount: number;


    @ApiProperty({
        description: '提现单号',
        required: true
    })
    withdrawalNo: string;

    @ApiProperty({
        description: '提现结果记录',
        required: true
    })
    withdrawalResult: string;

    @ApiProperty({
        description: '提现类型',
        required: true
    })
    withdrawal: string;

    @ApiProperty({
        description: '提现类型名称',
        required: true
    })
    withdrawalText: string;


    @ApiProperty({
        description: '审核状态',
        required: true
    })
    status: string;

    @ApiProperty({
        description: '审核状态名称',
        required: true
    })
    statusText: string;


    @ApiProperty({
        description: '拒绝原因',
        required: false
    })
    rejectReason: string;


    @ApiProperty({
        description: '审核人',
        required: false
    })
    reviewedBy: string;


    @ApiProperty({
        description: '审核人校验方式',
        required: false
    })
    reviewedCheckType: string;

    @ApiProperty({
        description: '审核人校验方式名称',
        required: false
    })
    reviewedCheckTypeText: string;


    @ApiProperty({
        description: '审核人校验信息',
        required: false
    })
    reviewerVerificationMethod: string;


    @ApiProperty({
        description: '审核通过时间',
        required: false
    })
    passDate: Date;


    @ApiProperty({
        description: '备注',
        required: false
    })
    remarks: string;


}