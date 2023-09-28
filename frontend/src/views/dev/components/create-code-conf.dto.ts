// 生成代码配置
export class CreateCodeConfDto {
    constructor() {
        this.backend = true;
        this.frontend = true;
        this.isTemp = true;
        this.config = new CreateConf();
        this.backendFile = new BackendFile();
        this.frontendFile = new FrontEndFile();
    }
    /**
     * 是否生成前端
     */
    frontend?: boolean;
    /**
     * 是否生成后端
     */
    backend?: boolean;

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
    isTemp?: boolean;

    /**
     * 生成配置
     */
    config!: CreateConf;
    backendFile!: BackendFile;
    frontendFile!: FrontEndFile;
}
export class BackendFile {
    constructor() {
        this.dto = true;
        this.pageDto = true;
        this.controller = true;
        this.service = true;
        this.module = true;
    }
    dto?: boolean;
    pageDto?: boolean;
    controller?: boolean;
    service?: boolean;
    module?: boolean;
}
export class FrontEndFile {
    constructor() {
        this.list = true;
        this.form = true;
        this.search = true;
        this.dto = true;
        this.api = true;
    }
    list?: boolean;
    form?: boolean;
    search?: boolean;
    dto?: boolean;
    api?: boolean;
}
export class CreateConf {
    constructor() {
        this.add = true;
        this.del = true;
        this.update = true;
        this.query = true;
        this.UUID = true;
    }
    add?: boolean;
    del?: boolean;
    update?: boolean;
    query?: boolean;
    UUID?: boolean;
}
export enum UNI_LIST_TYPE {
    "正常" = 1,
    "tab切换" = 2,
}