import { Logger } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
const logger = new Logger('ResponseInfoDto');
export class ResponseInfoDto<T>{
    constructor(status?: INFO_STATUS, message?: string, data: T = null) {
        this.status = status;
        this.data = data;
        this.message = message;
    }

    @ApiProperty({
        description: '状态：-1错误，0警告，1成功'
    })
    status: INFO_STATUS;
    @ApiProperty({
        description: '响应数据'
    })
    data: T;
    @ApiProperty({
        description: '提示消息'
    })
    message: string;
    success(message: string, data?: T) {
        this.data = data;
        this.message = message;
        this.status = INFO_STATUS.success;
        return this;
    }
    warring(message: string, data?: T) {
        this.data = data;
        this.message = message;
        this.status = INFO_STATUS.warring;
        logger.warn(message, data);
        return this;
    }
    error(message: string, data?: T) {
        this.data = data;
        this.message = message;
        this.status = INFO_STATUS.error;
        logger.error(message, data);
        return this;
    }
}
export enum INFO_STATUS {
    error = -1,
    warring = 0,
    success = 1,
}