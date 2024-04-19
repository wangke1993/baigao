import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";

export class MemberPageForm extends PageRequestDto {
    @ApiProperty({
        description: '会员等级',
        type: String,
        required: false
    })
    memberRank: string;
}