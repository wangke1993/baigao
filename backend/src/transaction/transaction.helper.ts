import { Injectable, Logger } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class TransactionHelper {
    private readonly logger = new Logger(TransactionHelper.name);
    constructor(
        @InjectConnection() private connection: Connection
    ) { }
    async startTransactionAuto(): Promise<ClientSession> {
        const session: ClientSession = await this.connection.startSession();
        return session;
    }
}