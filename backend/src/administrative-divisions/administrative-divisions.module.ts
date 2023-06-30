import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdministrativeDivisionsController } from './administrative-divisions.controller';
import { AdministrativeDivisionsService } from './administrative-divisions.service';
import { Area, AreaSchema } from './dto/area.schema';
import { City, CitySchema } from './dto/city.schema';
import { Province, ProvinceSchema } from './dto/province.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Province.name, schema: ProvinceSchema }]),
        MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
        MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    ],
    providers: [AdministrativeDivisionsService],
    controllers: [AdministrativeDivisionsController]
})
export class AdministrativeDivisionsModule { }
