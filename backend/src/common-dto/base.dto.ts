import { ApiProperty } from "@nestjs/swagger";

export class BaseDTO {
    constructor(req?: any) {
        if (req) {
            this.updateUser = req?.user?.userName;
            this.updateDate = new Date();
            this.addUser = req?.user?.userName;
            this.addDate = new Date();
        }
    }
    update() {
        delete this.addUser;
        delete this.updateDate;
        return this;
    }
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