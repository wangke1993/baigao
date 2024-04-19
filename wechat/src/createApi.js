const { default: axios } = require("axios");
const fs = require('fs');
//const url = 'http://qiancui.qixiankeji.cn/swagger-json';
const url = 'http://localhost:3001/swagger-json';
const apiPath = './api';
const apiTag = '';
const dtoPath = './api/dto';

function getFiled (name, typeObj, required) {
    return `
    /**
     * ${typeObj.description}
     */
    ${name}${required ? '!' : '?'}: ${typeObj.type === 'array' ? getType(typeObj.items.type) + '[]' : getType(typeObj.type)};
    `
}
function getClass (name, filedText) {
    return `export class ${name}Dto {
${filedText}
}`
}
function getType (type) {
    const typeConfig = {
        'string': 'String',
        'number': 'String'
    }
    if (typeConfig[type]) {
        return typeConfig[type];
    } else {
        return type;
    }
}
function clearPath () {
    delDir(apiPath);
}
function delDir (dir) {
    try {
        let files = fs.readdirSync(dir)
        files.forEach(file => {
            let curPath = dir + '/' + file;
            let fileType = fs.statSync(curPath)
            fileType.isDirectory() ? delDir(curPath) : fs.unlinkSync(curPath)
        })
    } catch (error) {
        console.log(error)
    }
}
function titleCase (str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}
function getApiText (apiPath = '', apiObj = {}) {
    const apiUrl = apiPath.replaceAll('/{', '/${');
    let apiType = Object.keys(apiObj)[0]; //请求方式
    const apiOption = apiObj[apiType]; //api相关配置
    const apiSummary = apiOption.summary; //特殊标记替换apiType：uploadFile,downFile
    if (apiSummary) {
        apiType = apiSummary;
    }
    const apiName = apiOption.operationId.split('_')[0] + titleCase(apiOption.operationId.split('_')[1]);
    //获取路径参数配置
    let pathParam = '', query = '', description = '';
    for (let i in apiOption?.parameters) {
        const item = apiOption.parameters[i];
        if (item.in === 'path') {
            pathParam += `${item.name},`;
            description += `${item.name}：${item.name};`;
        }
        if (item.in === 'query') {
            query += `${item.name},`;
            description += `${item.name}：${item.description};`;
        }
    }
    if (query.endsWith(',')) {
        query = query.substring(0, query.length - 1);
    }
    if (pathParam.endsWith(',') && !query) {
        pathParam = pathParam.substring(0, pathParam.length - 1);
    }
    /**
     * 请求方式：
     * 接口名称：
     * 接口参数：parameters（query，path），requestBody
     * 请求地址：
     */
    let apiConfig = {
        uploadFile () {
            return `
/**
* ${apiOption.description}
* ${description}
* @returns 
*/
export function ${apiName}(file){
   const files = [file];
   const name = 'file';
   return uni.uploadFile(\`${apiTag}${apiUrl}\`, {files,name});
}`
        },
        downFile () {
            return `
/**
* ${apiOption.description}
* ${description}
* @returns 
*/
export function ${apiName}(${pathParam}){
   return get(\`${apiTag}${apiUrl}\`);
}`
        },
        post () {
            //获取Dto名称
            const dtoName = apiOption?.requestBody?.content['application/json'].schema['$ref']?.split('/')[3];
            return `
/**
* ${apiOption.description}
* ${description}
* @returns 
*/
export function ${apiName}(${pathParam}${pathParam && dtoName ? ',' : ''}${dtoName ? dtoName + 'Dto' : ''}){
   return post(\`${apiTag}${apiUrl}\`, ${dtoName ? dtoName + 'Dto' : '{}'});
}`
        },
        get () {
            return `
/**
* ${apiOption.description}
* ${description}
* @returns 
*/
export function ${apiName}(${pathParam}${query !== '' ? 'query' : ''}){
	// query:{${query}} 
   return get(\`${apiTag}${apiUrl}\`, ${query !== '' ? 'query' : '{}'});
}`
        },
        delete () {
            return `
/**
* ${apiOption.description}
* ${description}
* @returns 
*/
export function ${apiName}(${pathParam} ){
   return del(\`${apiTag}${apiUrl}\`);
}
             `
        }
    }
    return apiConfig[apiType]();
}
function getApiListText (tag, apiText, apiDtoText) {
    return `
/**
* ${tag}
*/
import {post,get,del} from '@/utils/request.js';
${apiDtoText}
${apiText}
`;
}
function start () {
    axios.get(url).then((res) => {
        //组织dto文件内容
        // const dtoObj = res.data.components.schemas;
        // for (let i in dtoObj) {
        //     const dto = dtoObj[i];
        //     let filedText = '';
        //     for (let j in dto.properties) {
        //         filedText += getFiled(j, dto.properties[j], dto.required?.includes(j));
        //     }
        //     const classText = getClass(i, filedText);
        //     fs.writeFileSync(`${dtoPath}/${i}Dto.js`, classText);
        // }
        //组织api文件内容
        const apiObj = res.data.paths;
        const apiClassify = {};
        const apiClassifyTags = {};
        const apiClassifyDtoList = {};
        for (let i in apiObj) {
            const apiType = Object.keys(apiObj[i])[0]; //请求方式
            const apiOption = apiObj[i][apiType]; //api相关配置
            const apiText = getApiText(i, apiObj[i]);
            const className = apiOption.operationId.split('_')[0];
            if (!apiClassify[className]) {
                apiClassify[className] = '';
            }
            apiClassify[className] += apiText;
            apiClassifyTags[className] = apiOption.tags[0];
            const dtoName = apiOption?.requestBody?.content['application/json'].schema['$ref']?.split('/')[3];
            if (dtoName) {
                if (!apiClassifyDtoList[className]) {
                    apiClassifyDtoList[className] = {};
                }
                apiClassifyDtoList[className][dtoName] = `// ${dtoName}Dto：./dto/${dtoName}Dto';
`;
            }
        }
        //创建api文件
        for (let i in apiClassify) {
            const tag = apiClassifyTags[i];
            const apiText = apiClassify[i];
            let apiDtoText = '';
            for (let j in apiClassifyDtoList[i]) {
                if (apiClassifyDtoList[i][j]) {
                    apiDtoText += apiClassifyDtoList[i][j];
                }
            }
            const apiFileText = getApiListText(tag, apiText, apiDtoText);
            fs.writeFileSync(`${apiPath}/${i}Api.js`, apiFileText);
        }

    });
}
clearPath();
try {
    start();
} catch (error) {
    console.log(error.message);
}


