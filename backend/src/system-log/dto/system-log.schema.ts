import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SystemLog extends Document {
    @Prop()
    modelName: string;
    @Prop()
    requestUrl: string;
    @Prop()
    operationContent: string;
    @Prop()
    operationUserId: string;
    @Prop()
    operationUserName: string;
    @Prop()
    operationUserInfo: String;
    @Prop()
    operationTime: Date;
    @Prop()
    operationIp: string;
    @Prop()
    clientInfo: string;
    @Prop()
    systemInfo: string;
    @Prop()
    comeFrom: string;
}

export type SystemLogDocument = SystemLog & Document;

export const SystemLogSchema = SchemaFactory.createForClass(SystemLog);