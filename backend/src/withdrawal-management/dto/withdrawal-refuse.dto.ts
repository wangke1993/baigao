import { ApiProperty } from "@nestjs/swagger";

export class WithdrawalRefuseDto {
    @ApiProperty({
        description: '记录id',
        required: false
    })
    id: string;
    
    @ApiProperty({
        description: '拒绝原因',
        required: false
    })
    reason: string;
}