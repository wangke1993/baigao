import { ApiProperty } from "@nestjs/swagger";

export class WeChatRegister {
    @ApiProperty({
        description: 'openid',
    })
    openId: string;

    @ApiProperty({
        description: 'unionid',
    })
    unionid: string;

    @ApiProperty({
        description: '用户名称',
    })
    userName: string;

    @ApiProperty({
        description: '用户头像',
    })
    avatar: string;

    @ApiProperty({
        description: '用户性别',
    })
    sex: number;

    @ApiProperty({
        description: '上级openId',
    })
    parentOpenId?: string;
}