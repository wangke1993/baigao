import { ApiProperty } from "@nestjs/swagger";

export class PageResponseDto<T>{
    constructor() {
        this.total = 0;
        this.list = [];
    }
    @ApiProperty({
        description:"总数"
    })
    total: number;
    @ApiProperty({
        description:"数据列表"
    })
    list: T[];
}