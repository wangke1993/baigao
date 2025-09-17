import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { CreateCodeConfDto } from "./dto/create-code-conf.dto";
import { deleteFolderRecursive } from "src/file-upload/utils/file-tools";
import * as ejs from 'ejs';
import { ModuleConf } from "./dto/module-conf.schema";
import { ModuleField } from "./dto/module-field.schema";
import { ModuleSearch } from "./dto/module-search.schema";
import { DicTree } from "src/data-dictionary/dto/dic-tree.dto";

const PATH_CONF = {
    backend: __dirname.replace('dist\\system-dev', 'src'),
    frontend: __dirname.replace('backend', 'frontend').replace('dist\\system-dev', 'src\\views'),
}
const TEMP_PATH_CONF = {
    backend: PATH_CONF.backend.replace('src', 'src\\temp'),
    frontend: PATH_CONF.frontend.replace('src\\views', 'src\\temp'),
}
const EJS_PATH = `${PATH_CONF.backend}/system-dev/ejs-tpl`
const BACKEND_TPL = {
    "DTO": `${EJS_PATH}/backend/dto.ejs`,
    "DIC": `${EJS_PATH}/backend/dic.ejs`,
    "PAGE": `${EJS_PATH}/backend/page.ejs`,
    "MODULE": `${EJS_PATH}/backend/module.ejs`,
    "SERVICE": `${EJS_PATH}/backend/service.ejs`,
    "CONTROLLER": `${EJS_PATH}/backend/controller.ejs`,
}
const FRONTEND_TPL = {
    "DTO": `${EJS_PATH}/frontend/dto.ejs`,
    "API": `${EJS_PATH}/frontend/api.ejs`,
    "LIST": `${EJS_PATH}/frontend/list.ejs`,
    "SEARCH": `${EJS_PATH}/frontend/search.ejs`,
    "FORM": `${EJS_PATH}/frontend/form.ejs`,
    "DOM": `${EJS_PATH}/frontend/dom.ejs`,
    "DOM_EVENT": `${EJS_PATH}/frontend/dom-event.ejs`,
}
export class DevTools {
    conf: CreateCodeConfDto;
    savePath: {
        backend: string,
        backendDto: string;
        frontend: string,
        frontendComponents: string,
        frontendApi: string,
        frontendDto: string,
    }
    constructor(conf?: CreateCodeConfDto) {
        if (!existsSync(PATH_CONF.backend)) {
            throw new Error("仅在本地开发环境可用");
        }
        this.conf = conf;
        this.savePath = {
            backend: "",
            backendDto: "",
            frontend: "",
            frontendApi: "",
            frontendDto: "",
            frontendComponents: "",
        }
        this.big = {};
        this.small = {};
    }
    createDic(dicTree: DicTree[]) {
        this.render(
            BACKEND_TPL.DIC,
            { dicTree },
            `${PATH_CONF.backend}/data-dictionary/dic-enum.ts`
        );
        this.render(
            BACKEND_TPL.DIC,
            { dicTree },
            `${PATH_CONF.frontend.replace('views', 'common')}/dic-enum.ts`
        );
    }
    createDto(moduleConf: ModuleConf, fieldList: ModuleField[], searchOldList: ModuleSearch[]) {
        if (this.conf.backendFile.dto) {
            // 生成数据模型
            this.render(
                BACKEND_TPL.DTO,
                { moduleConf, fieldList },
                `${this.savePath.backendDto}/${moduleConf.nameEn}.schema.ts`
            );
        } else {
            // deleteFolderRecursive(`${this.savePath.backendDto}/${moduleConf.nameEn}.schema.ts`);
        }
        if (this.conf.backendFile.pageDto) {
            // 生成分页模型，排除模糊搜索项目
            const searchList = searchOldList.filter(item => item.method != 'like');
            if (searchList.length > 0) {
                this.render(
                    BACKEND_TPL.PAGE,
                    { moduleConf, searchList },
                    `${this.savePath.backendDto}/${moduleConf.nameEn}-page.dto.ts`
                );
            } else {
                // deleteFolderRecursive(`${this.savePath.backendDto}/${moduleConf.nameEn}-page.dto.ts`);
            }
        } else {
            // deleteFolderRecursive(`${this.savePath.backendDto}/${moduleConf.nameEn}-page.dto.ts`);
        }

    }
    createService(moduleConf: ModuleConf, searchList: ModuleSearch[], filedList: ModuleField[]) {
        if (this.conf.backendFile.service) {
            // 生成列表隐藏字段内容
            let listShow = filedList.filter(item => {
                return !item.listShow && item.nameEn;
            }).map(item => `${item.nameEn}:0`).join(',');
            if (listShow && listShow.length > 0) {
                listShow = `,{${listShow}}`
            } else {
                listShow = ''
            }
            this.render(
                BACKEND_TPL.SERVICE,
                {
                    moduleConf,
                    searchListForLike: searchList.filter(item => item.method == 'like'),
                    searchListForOther: searchList.filter(item => item.method != 'like'),
                    listShow
                },
                `${this.savePath.backend}/${moduleConf.nameEn}.service.ts`
            );
        } else {
            // deleteFolderRecursive(`${this.savePath.backend}/${moduleConf.nameEn}.service.ts`);
        }
    }
    getMethodString = (item: ModuleSearch) => {
        // 统一前缀page.
        switch (item.method) {
            case "=":
                return `{ $eq: page.${item.fieldEnName} }`;
            case "in":
                return `{ $in: page.${item.fieldEnName} }`;
            case ">":
                return `{ $gt: page.${item.fieldEnName} }`;
            case "<":
                return `{ $lt: page.${item.fieldEnName} }`;
            case ">=":
                return `{ $gte: page.${item.fieldEnName} }`;
            case "<=":
                return `{ $lte: page.${item.fieldEnName} }`;
            case "!=":
                return `{ $ne: page.${item.fieldEnName} }`;
        }
    }
    createController(moduleConf: ModuleConf, searchList: ModuleSearch[]) {
        if (this.conf.backendFile.controller) {
            this.render(
                BACKEND_TPL.CONTROLLER,
                {
                    moduleConf,
                    usePageDto: searchList.filter(item => item.method != 'like').length
                },
                `${this.savePath.backend}/${moduleConf.nameEn}.controller.ts`
            )
        } else {
            // deleteFolderRecursive(`${this.savePath.backend}/${moduleConf.nameEn}.controller.ts`);
        }
    }
    createModule(moduleConf: ModuleConf) {
        if (this.conf.backendFile.module) {
            this.render(
                BACKEND_TPL.MODULE,
                { moduleConf },
                `${this.savePath.backend}/${moduleConf.nameEn}.module.ts`
            )
        } else {
            // deleteFolderRecursive(`${this.savePath.backend}/${moduleConf.nameEn}.module.ts`);
        }
    }
    createFrontendDto(moduleConf: ModuleConf, fieldList: ModuleField[],) {
        if (this.conf.frontendFile.dto) {
            this.render(
                FRONTEND_TPL.DTO,
                { moduleConf, fieldList },
                `${this.savePath.frontendDto}/${this.getBigModuleTitle(moduleConf.nameEn)}Dto.ts`
            )
        } else {
            // deleteFolderRecursive(`${this.savePath.frontendDto}/${this.getBigModuleTitle(moduleConf.nameEn)}Dto.ts`);
        }
    }
    createFrontendApi(moduleConf: ModuleConf, searchList: ModuleSearch[]) {
        if (this.conf.frontendFile.dto) {
            this.render(
                FRONTEND_TPL.API,
                {
                    moduleConf,
                    searchNoLike: searchList.filter(item => item.method != 'like')
                },
                `${this.savePath.frontendApi}/${this.getBigModuleTitle(moduleConf.nameEn)}ControllerApi.ts`
            )
        } else {
            // deleteFolderRecursive(`${this.savePath.frontendApi}/${this.getBigModuleTitle(moduleConf.nameEn)}ControllerApi.ts`);
        }
    }
    createListPage(moduleConf: ModuleConf, fieldList: ModuleField[], searchList: ModuleSearch[]) {
        if (this.conf.frontendFile.list) {
            this.render(
                FRONTEND_TPL.LIST,
                {
                    moduleConf,
                    fieldList,
                    searchNoLike: searchList.filter(item => item.method != 'like')
                },
                `${this.savePath.frontend}/Index.vue`
            )
        } else {
            // deleteFolderRecursive(`${this.savePath.frontend}/Index.vue`);
        }
    }
    createSearchPage(moduleConf: ModuleConf, searchList: ModuleSearch[]) {
        if (this.conf.frontendFile.search) {
            this.render(
                FRONTEND_TPL.SEARCH,
                {
                    searchLike: searchList.filter(item => item.method == 'like'),
                    searchNoLike: searchList.filter(item => item.method != 'like'),
                    searchNoLikeAuto: searchList.filter(item => item.method != 'like' && item.isAuto),
                    DomConf: (moduleSearch: ModuleSearch) => {
                        return {
                            tpl: FRONTEND_TPL.DOM,
                            data: moduleSearch,
                            dom: moduleSearch.dom,
                            fieldEnName: moduleSearch.fieldEnName,
                            fieldName: moduleSearch.fieldName,
                            fieldType: moduleSearch.fieldType,
                            search: true,
                            VModule: `searchForm.${moduleSearch.fieldEnName}`
                        }
                    },
                    DomEventConf: (moduleSearch: ModuleSearch) => {
                        return {
                            tpl: FRONTEND_TPL.DOM_EVENT,
                            data: moduleSearch,
                            dom: moduleSearch.dom,
                            fieldEnName: moduleSearch.fieldEnName,
                            fieldName: moduleSearch.fieldName,
                            fieldType: moduleSearch.fieldType,
                            search: true,
                            VModule: `searchForm.value.${moduleSearch.fieldEnName}`
                        }
                    },
                },
                `${this.savePath.frontendComponents}/${this.getBigModuleTitle(moduleConf.nameEn)}Search.vue`
            )
        } else {
            // deleteFolderRecursive(`${this.savePath.frontendComponents}/${this.getBigModuleTitle(moduleConf.nameEn)}Search.vue`);
        }
    }
    createFormPage(moduleConf: ModuleConf, fieldList: ModuleField[],) {
        if (this.conf.frontendFile.form) {
            this.render(
                FRONTEND_TPL.FORM,
                {
                    fieldList,
                    moduleConf,
                    DomConf: (moduleField: ModuleField) => {
                        return {
                            tpl: FRONTEND_TPL.DOM,
                            data: moduleField,
                            dom: moduleField.dom,
                            fieldEnName: moduleField.nameEn,
                            fieldName: moduleField.name,
                            fieldType: moduleField.type,
                            search: false,
                            VModule: `form.${moduleField.nameEn}`
                        }
                    },
                    DomEventConf: (moduleField: ModuleField) => {
                        return {
                            tpl: FRONTEND_TPL.DOM_EVENT,
                            data: moduleField,
                            dom: moduleField.dom,
                            fieldEnName: moduleField.nameEn,
                            fieldName: moduleField.name,
                            fieldType: moduleField.type,
                            search: false,
                            VModule: `form.value.${moduleField.nameEn}`
                        }
                    },
                },
                `${this.savePath.frontendComponents}/${this.getBigModuleTitle(moduleConf.nameEn)}Form.vue`
            )
        } else {
            // deleteFolderRecursive(`${this.savePath.frontendComponents}/${this.getBigModuleTitle(moduleConf.nameEn)}Form.vue`);
        }
    }
    render(tplPath: string, data: any, filePath?: string) {
        const res = ejs.render(readFileSync(tplPath).toString(), { ...this, ...data });
        if (filePath) {
            this.createFile(filePath, res);
        } else {
            if (res.trim()) {
                return res;
            } else {
                return "";
            }
        }
    }
    /**
     * 创建前后端代码目录
     * @param moduleName 模型名称，多单词使用“-”隔开
     */
    createModuleDir(moduleName: String) {
        const path = this.conf.isTemp ? TEMP_PATH_CONF : PATH_CONF;
        if (this.conf.backend) {
            this.savePath.backend = `${path.backend}/${moduleName}`
            if (!existsSync(path.backend)) {
                mkdirSync(path.backend);
            }
            if (!existsSync(this.savePath.backend)) {
                mkdirSync(this.savePath.backend);
            }
            this.savePath.backendDto = `${this.savePath.backend}/dto`
            if (!existsSync(this.savePath.backendDto)) {
                mkdirSync(this.savePath.backendDto);
            }
        }
        if (this.conf.frontend) {
            // 小驼峰命名
            this.savePath.frontend = `${path.frontend}/${this.getSmallModuleTitle(moduleName)}`
            // 前端大驼峰命名
            // this.savePath.frontend = `${path.frontend}/${this.getBigModuleTitle(moduleName)}`
            this.savePath.frontendComponents = `${path.frontend}/${this.getSmallModuleTitle(moduleName)}/components`
            this.savePath.frontendApi = `${PATH_CONF.frontend.replace("views", "")}api`;
            this.savePath.frontendDto = `${PATH_CONF.frontend.replace("views", "")}api/dto`;
            if (!existsSync(path.frontend)) {
                mkdirSync(path.frontend);
            }
            if (!existsSync(this.savePath.frontend)) {
                mkdirSync(this.savePath.frontend);
            }
            if (!existsSync(this.savePath.frontendComponents)) {
                mkdirSync(this.savePath.frontendComponents);
            }
        }
    }
    /**
     * 创建文件
     * @param path 文件地址
     * @param content 文件内容
     */
    createFile(path: string, content: string) {
        writeFileSync(path, content);
    }
    /**
     * 递归删除文件夹
     * @param path 文件夹路径
     */
    deleteFolder(path: string) {
        deleteFolderRecursive(path);
    }
    createTmpPath() {
        if (!existsSync(TEMP_PATH_CONF.backend)) {
            mkdirSync(TEMP_PATH_CONF.backend);
        }
        if (!existsSync(TEMP_PATH_CONF.frontend)) {
            mkdirSync(TEMP_PATH_CONF.frontend);
        }
    }
    small: any;
    /**
    * 获取小驼峰命名
    * @param moduleName 模型名称，多单词使用“-”隔开
    */
    getSmallModuleTitle = (moduleName: String) => {
        if (!this.small[`${moduleName}`]) {
            const bigName = this.getBigModuleTitle(moduleName);
            this.small[`${moduleName}`] = `${bigName.slice(0, 1).toLowerCase()}${bigName.slice(1)}`;
        }
        return this.small[`${moduleName}`];
    }
    big: any;
    /**
    * 获取大驼峰命名
    * @param moduleName 模型名称，多单词使用“-”隔开
    */
    getBigModuleTitle = (moduleName: String) => {
        if (!this.big[`${moduleName}`]) {
            const arr = moduleName.split("-");
            this.big[`${moduleName}`] = arr.map(word => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`).join("");
        }
        return this.big[`${moduleName}`]
    }
}

