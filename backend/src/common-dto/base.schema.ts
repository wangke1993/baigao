import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export class BaseSchema extends Document {

    @ApiProperty({
        required: false,
        description: '最后更新用户',
    })
    @Prop()
    addUser: string;
    @ApiProperty({
        required: false,
        description: '添加时间',
    })
    @Prop()
    addDate: Date;
    @ApiProperty({
        required: false,
        description: '最后更新用户',
    })
    @Prop()
    updateUser: string;
    @ApiProperty({
        required: false,
        description: '最后更新时间',
    })
    @Prop()
    updateDate: Date;

    @ApiProperty({
        required: false,
        description: '文件UUID数组，只要文章上传文件，保留原有数据且把上传的文件UUID都push到该数组中。',
    })
    @Prop()
    fileIds: string[];
}