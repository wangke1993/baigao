import { ApiProperty } from "@nestjs/swagger";

export class SystemLogDto {

    @ApiProperty({ description: '模块名称' })
    modelName: String;

    @ApiProperty({ description: '请求路径' })
    requestUrl: String;

    @ApiProperty({ description: '操作内容' })
    operationContent: String;

    @ApiProperty({ description: '操作账号ID' })
    operationUserId: String;

    @ApiProperty({ description: '操作账号名称' })
    operationUserName: String;

    @ApiProperty({ description: '操作账号全量信息' })
    operationUserInfo: String;

    @ApiProperty({ description: '操作时间' })
    operationTime: Date;

    @ApiProperty({ description: '操作IP' })
    operationIp: String;

    @ApiProperty({ description: '用户浏览器信息' })
    clientInfo: String;

    @ApiProperty({ description: '用户系统信息' })
    systemInfo: String;

    @ApiProperty({ description: '来源' })
    comeFrom: String;
}