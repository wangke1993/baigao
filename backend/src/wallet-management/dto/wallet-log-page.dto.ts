import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";

export class WalletLogPageDto extends PageRequestDto {
    
    @ApiProperty({
        description: '所属钱包',
        type: String,
    })
    walletUUID: String;
    @ApiProperty({
        description: '流向: 1收入,-1支出',
        type: String,
    })
    logType: String;
}