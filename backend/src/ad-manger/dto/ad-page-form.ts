import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";

export class AdPageForm extends PageRequestDto {
    @ApiProperty({
        description: '广告位置，取字典管理中：DC0002的值',
        type: String,
        required: false
    })
    position: string;
    @ApiProperty({
        description: '发布状态，0全部，1已发布，2未发布',
        type: Number,
        required: false
    })
    isRelease: number;
}