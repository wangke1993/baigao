import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Controller, Get, Param } from "@nestjs/common";
import { CreateDelayTaskService } from "./create-delay-task.service";
import { DelayTaskService } from "./delay-task.service";

@Controller('createDelayTask')
export class CreateDelayTaskController {
    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly createDelayTaskService: CreateDelayTaskService
    ) { }

    // @Get('test/:n')
    // async msg(@Param('n') n: number): Promise<any> {
    //     this.createDelayTaskService.createTask(n);
    // }
}