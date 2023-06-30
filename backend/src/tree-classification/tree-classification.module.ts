import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLogModule } from 'src/system-log/system-log.module';
import { TreeClassificationController } from './tree-classification.controller';
import { TreeClassificationService } from './tree-classification.service';
import { TreeClassification, TreeClassificationSchema } from './dto/tree-classification.schema';
import { TransactionModule } from 'src/transaction/transaction.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TreeClassification.name, schema: TreeClassificationSchema }]),
        SystemLogModule,
        RedisCacheModule,
        TransactionModule
    ],
    providers: [TreeClassificationService],
    exports: [TreeClassificationService],
    controllers: [TreeClassificationController]
})
export class TreeClassificationModule { }
