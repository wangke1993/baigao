import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";
import { DC0008 } from "src/system-config/dto/system-config.schema";

export class MemberPageForm extends PageRequestDto {
    @ApiProperty({
        description: '会员等级',
        type: String,
        required: false
    })
    memberRank: DC0008;
}