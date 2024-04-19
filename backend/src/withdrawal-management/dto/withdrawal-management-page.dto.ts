import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";

export class WithdrawalManagementPageDto extends PageRequestDto {
    
    @ApiProperty({
        description: '审核状态',
        type: String,
    })
    status: String;
    
    @ApiProperty({
        description: '提现类型',
        type: String,
    })
    withdrawal: String;

    @ApiProperty({
        description: '提现钱包',
        type: String,
    })
    walletUUID: String;
    
}