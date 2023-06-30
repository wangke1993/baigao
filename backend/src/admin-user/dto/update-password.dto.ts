import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto{
    @ApiProperty({
        description:'原密码'
    })
    oldPassword: string;
    @ApiProperty({
        description:'新密码'
    })
    newPassword: string;
}