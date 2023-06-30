import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { Area, AreaDocument } from './dto/area.schema';
import { City, CityDocument } from './dto/city.schema';
import { AREA_TYPE, Province, ProvinceDocument } from './dto/province.schema';

@Injectable()
export class AdministrativeDivisionsService {

    constructor(
        @InjectModel(City.name) private CityModel: Model<CityDocument>,
        @InjectModel(Province.name) private ProvinceModel: Model<ProvinceDocument>,
        @InjectModel(Area.name) private AreaModel: Model<AreaDocument>,
    ) { };
    async getListByParentCode(areaType: number, parentCode: string,): Promise<any[]> {
        if (areaType == AREA_TYPE.province) {
            return await this.ProvinceModel.find();
        }
        if (areaType == AREA_TYPE.city) {
            return await this.CityModel.find({
                provinceCode: parentCode
            });
        }
        if (areaType == AREA_TYPE.area) {
            return await this.AreaModel.find({
                cityCode: parentCode
            });
        }
        throw new Error("没有匹配的行政区划类型");
    }
}
