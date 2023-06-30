import { ApiProperty } from "@nestjs/swagger";

export class LoginFrom {
    @ApiProperty({
        description: '用户名',
        required: true,
    })
    userName: string;
    @ApiProperty({
        description: '密码',
        required: true,
    })
    password: string;

}