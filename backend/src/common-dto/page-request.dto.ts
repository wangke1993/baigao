import { ApiProperty } from "@nestjs/swagger";

export class PageRequestDto{
    @ApiProperty({
        description: '单页显示条数'
    })
    pageSize: number;
    @ApiProperty({
        description: '当前页码'
    })
    pageIndex: number;
    @ApiProperty({
        description: '搜索关键字',
        required: false
    })
    keyWord: string;
    
}