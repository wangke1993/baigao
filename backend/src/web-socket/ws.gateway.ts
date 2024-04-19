
import { Injectable, UseFilters, UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { OnGatewayConnection } from "@nestjs/websockets/interfaces/hooks";
import { Server, Socket } from "socket.io";
import { JwtWsAuthGuard } from "src/auth/guard/jwt-ws-auth.guard";
import { WSReq } from "src/decorator/ws-req.decorator";
import { MEMBER_TASK_TYPE, MemberTaskDto } from "src/member-management/dto/member-task.dto";
import { MemberManagementService } from "src/member-management/member-management.service";
import { CreateTaskService } from "src/task-management/create-task.service";
/**
 * 服务端参考
 * 官方文档： https://nestjs.bootcss.com/websockets/gateways.html
 * github案例：
 */
@WebSocketGateway({ cors: { origin: "*" } })
@UseGuards(JwtWsAuthGuard)
@Injectable()
export class WsGateway implements OnGatewayConnection {
    // 广播
    @WebSocketServer()
    server: Server;

    constructor(
        private memberManagementService: MemberManagementService,
        private createTaskService: CreateTaskService
    ) {
        this.memberManagementService.allOffline();
    }
    @WSReq()
    async handleConnection(client: Socket, req: any) {
        console.log('客户端连接成功', client.id);
        // 用户上线 根据userUUID，设置上线的socket.id;
        await this.createTaskService.createTask(new MemberTaskDto(
            req.user.UUID,
            MEMBER_TASK_TYPE.上线,
            client.id
        ))

        client.on('disconnect', async () => {
            console.log('客户端连接销毁', client.id);
            // 用户下线 根据userUUID，删除下线的socket.id
            await this.createTaskService.createTask(new MemberTaskDto(
                req.user.UUID,
                MEMBER_TASK_TYPE.下线,
                ""
            ))
            // TODO: 消息模块 {userUUID,client:[miniProgram,admin],message:JSON,状态：已发送，未发送};
        });
        client.emit('message', "连接成功");
    }

    @WSReq()
    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket, req: any): void {
        console.log('收到消息', { data })
        // 单播
        // this.server.to(client.id).emit('message', data.msg);
        // 广播
        // this.server.emit('message', data.msg);
    }

    /**
     * 发送给所有连接的用户
     * @param event 事件命名
     * @param data 发送数据
     */
    toAll(event: string, data: any) {
        this.server.emit(event, data);
    }
    
    /**
     * 发送给指定socket
     * @param event 事件名称
     * @param socketId socketId
     * @param data 发送数据
     */
    to(event: string, socketId: string, data: any) {
        this.server.to(socketId).emit(event, data);
    }

}