import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class FileUpload extends Document {
    @Prop()
    fileName: string;
    @Prop()
    UUID: string;
    @Prop()
    size: string;
    @Prop()
    url: string
    @Prop()
    path: string;
    @Prop()
    fileType: FILE_TYPE;
    @Prop()
    addDate: Date;
    @Prop()
    contentType: string;
}
export enum FILE_TYPE {
    'img' = 1,
    'video' = 2,
    'audio' = 3,
    'doc' = 4,
    'software' = 5,
    'GZIP' = 6,
    'other' = 7
}
export class FileUploadModels {
    fileName: string;
    UUID: string;
    size: number;
    url: string
    path: string;
    fileType: FILE_TYPE;
    addDate: Date;
    contentType: string;
}
export type FileUploadDocument = FileUpload & Document;

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
