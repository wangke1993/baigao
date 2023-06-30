import { ApiProperty } from "@nestjs/swagger";
import { PageRequestDto } from "src/common-dto/page-request.dto";

export class PageForm extends PageRequestDto{
    @ApiProperty({ description: 'IP', type: String, required: false })
    IP: string;
    @ApiProperty({ description: '开始时间', type: Date , required: false})
    startTime: Date;
    @ApiProperty({ description: '结束时间', type: Date , required: false})
    endTime: Date;
    @ApiProperty({ description: '关键字:模块名称/请求路径/操作内容/账号名称', type: String , required: false})
    keyWord: string;
}