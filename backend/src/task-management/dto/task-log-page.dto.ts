import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";

export class TaskLogPageDto extends PageRequestDto {
    
    @ApiProperty({
        description: '任务类型',
        type: String,
    })
    taskType: String;
    
    @ApiProperty({
        description: '任务状态',
        type: String,
    })
    taskStatus: String;
    
}