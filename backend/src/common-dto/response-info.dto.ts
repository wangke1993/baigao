import { Logger } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
const logger = new Logger('ResponseInfoDto');
export class ResponseInfoDto<T>{
    constructor(req: any, status?: INFO_STATUS, message?: string, data: T = null) {
        this.startTime = new Date();
        this.status = status;
        this.data = data;
        this.message = message;
        this.request = req;
        if (!this.request.user) {
            this.request.user = {
                _id: "",
                userName: ""
            }
        }
        const { url, user: { _id: userID, userName }, sessionID } = this.request;
        logger.log(sessionID + JSON.stringify({ url, userID, userName }));
    }
    private request: any;
    private startTime: Date;
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
        logger.log(`${this.takeUpTime()}${this.request.sessionID}--success`);
        return this.res();
    }
    warring(message: string, data?: T) {
        this.data = data;
        this.message = message;
        this.status = INFO_STATUS.warring;
        const { params, query, sessionID } = this.request;
        logger.error(this.takeUpTime() + sessionID + JSON.stringify({ message, data, params, query }));
        return this.res();
    }
    error(message: string, data?: T) {
        this.data = data;
        this.message = message;
        this.status = INFO_STATUS.error;
        const { params, query, sessionID } = this.request;
        logger.error(this.takeUpTime() + sessionID + JSON.stringify({ message, data, params, query }));
        return this.res();
    }
    res() {
        this.request = this.request.sessionID;
        return this;
    }
    takeUpTime() {
        const Reset = '\x1b[0m';
        const FgRed = '\x1b[31m';
        const FgOrange = '\x1b[38;5;208m';
        const tut = Number(((new Date().getTime() - this.startTime.getTime()) / 1000).toFixed(3));
        if (tut > 1) {
            return `${FgOrange}【${tut}】s${Reset}`
        } else if (tut > 10) {
            return `${FgRed}$【{tut}】s${Reset}`
        }
        return `【${tut}s】`
    }
}
export enum INFO_STATUS {
    error = -1,
    warring = 0,
    success = 1,
}