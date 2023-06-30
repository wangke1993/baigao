import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";

export class DicPageForm extends PageRequestDto {
    @ApiProperty({
        description: '所属数据字典(dicCode)，为空时查询字典类型分页，有值时，查询字典分类下的字典值',
        type: String,
        required: false
    })
    dicClass: string;
}