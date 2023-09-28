import { ApiProperty } from "@nestjs/swagger";

export class BackendFile {
    @ApiProperty({
        description: 'dto',
        required: false
    })
    dto: boolean;
    @ApiProperty({
        description: 'pageDto',
        required: false
    })
    pageDto: boolean;
    @ApiProperty({
        description: 'controller',
        required: false
    })
    controller: boolean;
    @ApiProperty({
        description: 'service',
        required: false
    })
    service: boolean;
    @ApiProperty({
        description: 'module',
        required: false
    })
    module: boolean;
}
export class FrontEndFile {
    @ApiProperty({
        description: 'list',
        required: false
    })
    list: boolean;
    @ApiProperty({
        description: 'form',
        required: false
    })
    form: boolean;
    @ApiProperty({
        description: 'search',
        required: false
    })
    search: boolean;
    @ApiProperty({
        description: 'dto',
        required: false
    })
    dto: boolean;
    @ApiProperty({
        description: 'api',
        required: false
    })
    api: boolean;
}
export class CreateConf {
    @ApiProperty({
        description: 'add',
        required: false
    })
    add: boolean;
    @ApiProperty({
        description: 'del',
        required: false
    })
    del: boolean;
    @ApiProperty({
        description: 'update',
        required: false
    })
    update: boolean;
    @ApiProperty({
        description: 'query',
        required: false
    })
    query: boolean;
    @ApiProperty({
        description: 'UUID',
        required: false
    })
    UUID: boolean;
}
// 生成代码配置
export class CreateCodeConfDto {
    @ApiProperty({
        description: '是否生成前端',
        required: false
    })
    frontend: boolean;
    @ApiProperty({
        description: '是否生成后端',
        required: false
    })
    backend: boolean;

    /**
     * 是否生成到临时路径
     * 临时路径 
     *  前端：src/views/temp
     *  uni：src/views/temp-uni
     *  后端：src/temp
     * 正式路径：
     *  前端：src/views
     *  uni：src/views
     *  后端：src/
     */
    @ApiProperty({
        description: '是否生成到临时路径',
        required: false
    })
    isTemp: boolean;
    @ApiProperty({
        description: '生成配置',
        required: false
    })
    config: CreateConf;
    @ApiProperty({
        description: '后端文件配置',
        required: false
    })
    backendFile: BackendFile;
    @ApiProperty({
        description: '前端文件配置',
        required: false
    })
    frontendFile: FrontEndFile;
}
export enum UNI_LIST_TYPE {
    "正常" = 1,
    "tab切换" = 2,
}