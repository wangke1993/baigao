import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";

export class AdminUserPageDto extends PageRequestDto {
    @ApiProperty({
        description: '所属公司',
        required: false
    })
    companyUUID?: string;
}