import { ApiProperty } from "@nestjs/swagger";

export class BaseDTO {
    @ApiProperty({
        required: false,
        description: '最后更新用户',
    })
    addUser: string;
    @ApiProperty({
        required: false,
        description: '添加时间',
    })
    addDate: Date;
    @ApiProperty({
        required: false,
        description: '最后更新用户',
    })
    updateUser: string;
    @ApiProperty({
        required: false,
        description: '最后更新时间',
    })
    updateDate: Date;

    @ApiProperty({
        required: false,
        description: '文件id数组，只要文章上传文件，保留原有数据且把上传的文件id都push到该数组中。',
    })
    fileIds: string[];
}