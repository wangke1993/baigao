import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseInfoDto } from 'src/common-dto/response-info.dto';
import { AdministrativeDivisionsService } from './administrative-divisions.service';
import { AREA_TYPE } from './dto/province.schema';

@ApiTags('行政区划')
@Controller('admin/administrativeDivisions')
export class AdministrativeDivisionsController {
    constructor(private administrativeDivisionsService: AdministrativeDivisionsService) { };


    @Get('getAdministrativeDivisions/:parentCode')
    @ApiOperation({ description: '根据区域类型【parentCode】:行政区划的CODE,获取省时传0即可,获取省市区,无需权限校验' })
    async getListByDicClass(@Param("parentCode") parentCode: string): Promise<ResponseInfoDto<any[]>> {
        const rsp = new ResponseInfoDto<any[]>();
        try {
            let areaType: number;
            if (parentCode == '0') {
                areaType = AREA_TYPE.province;
            }
            if (parentCode.length == 2) {
                areaType = AREA_TYPE.city;
            }
            if (parentCode.length == 4) {
                areaType = AREA_TYPE.area;
            }
            rsp.success('获取成功', await this.administrativeDivisionsService.getListByParentCode(areaType, parentCode));
        } catch (e) {
            rsp.warring(e.toString());
        }
        return rsp;
    }
}
