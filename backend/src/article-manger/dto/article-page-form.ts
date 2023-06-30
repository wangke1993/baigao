import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";

export class ArticlePageForm extends PageRequestDto {
    @ApiProperty({
        description: '所属分类，取字典管理中：DC0001的值',
        type: String,
        required: false
    })
    articleClass: string;
    @ApiProperty({
        description: '发布状态，0全部，1已发布，2未发布',
        type: Number,
        required: false
    })
    isRelease: number;
}