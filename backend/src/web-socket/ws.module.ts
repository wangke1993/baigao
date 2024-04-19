import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { MemberManagementModule } from 'src/member-management/member-management.module';
import { TaskManagementModule } from 'src/task-management/task-management.module';

@Module({
    imports: [
        MemberManagementModule,
        TaskManagementModule
    ],
    providers: [WsGateway],
    exports: [WsGateway],
})
export class WSModule { }
