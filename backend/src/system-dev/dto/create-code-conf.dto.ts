// 生成代码配置
export class CreateCodeConfDto {
    /**
     * 是否生成前端
     */
    frontend: boolean;
    /**
     * 是否生成uin-app端
     */
    uniApp?: boolean;
    /**
     * 是否生成后端
     */
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
    isTemp: boolean;

    /**
     * 生成配置
     */
    config: CreateConf;
    backendFile: BackendFile;
    frontendFile: FrontEndFile;
}
export class BackendFile{
    dto: boolean;
    pageDto: boolean;
    controller: boolean;
    service: boolean;
    module: boolean;
}
export class FrontEndFile{
    list: boolean;
    form: boolean;
    search: boolean;
    dto: boolean;
    api: boolean;
}
export class CreateConf {
    add: boolean;
    del: boolean;
    update: boolean;
    query: boolean;
    UUID: boolean;
    uni?: {
        listType: UNI_LIST_TYPE;
        tabDataUrl?: String;
        tabValueField?: String;
        tabLabelField?: String;
        // tab匹配的数据库字段名称
        dataCheckField?: String;
    }
}
export enum UNI_LIST_TYPE {
    "正常" = 1,
    "tab切换" = 2,
}