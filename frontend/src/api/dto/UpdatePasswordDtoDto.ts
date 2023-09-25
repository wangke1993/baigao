export class UpdatePasswordDtoDto {

    _id?: string;
    /**
     * 原密码
     */
    oldPassword!: string;
    
    /**
     * 新密码
     */
    newPassword!: string;
    
}