import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { CreateCodeConfDto } from "./dto/create-code-conf.dto";
import { deleteFolderRecursive } from "src/file-upload/utils/file-tools";
import * as ejs from 'ejs';
import { ModuleConf } from "./dto/module-conf.schema";
import { ModuleField } from "./dto/module-field.schema";

const PATH_CONF = {
    backend: __dirname.replace('dist\\system-dev', 'src'),
    frontend: __dirname.replace('backend', 'frontend').replace('dist\\system-dev', 'src\\views'),
}
const TEMP_PATH_CONF = {
    backend: PATH_CONF.backend.replace('src', 'src\\temp'),
    frontend: PATH_CONF.frontend.replace('src\\views', 'src\\temp'),
}
const EJS_PATH = `${PATH_CONF.backend}/system-dev/ejs-tpl`
const TPL_CONF = {
    "DTO": `${EJS_PATH}/dto.ejs`
}
export class DevTools {
    conf: CreateCodeConfDto;
    savePath: {
        backend: string,
        backendDto: string;
        frontend: string,
        frontendApi: string,
        frontendDto: string,
    }
    constructor(conf: CreateCodeConfDto) {
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
        }
    }
    createDto(moduleConf: ModuleConf, fieldList: ModuleField[]) {
        this.render(
            TPL_CONF.DTO,
            { moduleConf, fieldList },
            `${this.savePath.backendDto}/${moduleConf.nameEn}.schema.ts`
        )
    }
    render(tplPath: string, data: any, filePath: string) {
        try {
            const res = ejs.render(readFileSync(tplPath).toString(), { ...this, ...data });
            this.createFile(filePath, res);
            return res;
        } catch (error) {
            console.error(error)
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
            this.savePath.frontendApi = `${PATH_CONF.frontend}/api`;
            this.savePath.frontendDto = `${PATH_CONF.frontend}/api/dto`;
            if (!existsSync(path.frontend)) {
                mkdirSync(path.frontend);
            }
            if (!existsSync(this.savePath.frontend)) {
                mkdirSync(this.savePath.frontend);
            } else {
                this.savePath.frontend += new Date().getTime();
                mkdirSync(this.savePath.frontend);
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
    /**
    * 获取小驼峰命名
    * @param moduleName 模型名称，多单词使用“-”隔开
    */
    getSmallModuleTitle = (moduleName: String) => {
        const big = this.getBigModuleTitle(moduleName);
        return `${big.slice(0, 1).toLowerCase()}${big.slice(1)}`;
    }
    /**
    * 获取大驼峰命名
    * @param moduleName 模型名称，多单词使用“-”隔开
    */
    getBigModuleTitle = (moduleName: String) => {
        const arr = moduleName.split("-");
        return arr.map(word => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`).join("");
    }
}

