const { default: axios } = require("axios");
const fs = require('fs');
const url = 'http://localhost:3001/apiDoc.json';
// const url = 'http://211.149.135.249:888/api/apiDoc.json';
const apiPath = './src/api';
const apiTag = '/api';
const dtoPath = './src/api/dto';

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
    if (type) {
        return type;
    } else {
        return 'any';
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
            pathParam += `${item.name}: ${getType(item.schema.type)},`;
            description += `${item.name}：${item.name};`;
        }
        if (item.in === 'query') {
            query += `${item.name}: ${getType(item.schema.type)},`;
            description += `${item.name}：${item.description};`;
        }
    }
    if (query.endsWith(',')) {
        query = query.substring(0, query.length - 1);
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
export const ${apiName} = (file: File, config?: any) => {
   const form = new FormData();
   form.append('file', file)
   return axios.post(\`${apiTag}${apiUrl}\`, form, config);
}`
        },
        downFile () {
            return `
/**
* ${apiOption.description}
* ${description}
* @returns 
*/
export const ${apiName} = (${pathParam}${query !== '' ? 'query: { ' + query + ' },' : ''} config?: any) => {
   return axios.get(\`${apiTag}${apiUrl}\`, { ${query !== '' ? 'params: query,' : ''}...config });
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
export const ${apiName} = (${pathParam}${dtoName ? 'data: ' + dtoName + 'Dto,' : ''} config?: any) => {
   return axios.post(\`${apiTag}${apiUrl}\`, ${dtoName ? 'data,' : '{},'} config);
}`
        },
        get () {
            return `
/**
* ${apiOption.description}
* ${description}
* @returns 
*/
export const ${apiName} = (${pathParam}${query !== '' ? 'query: { ' + query + ' },' : ''} config?: any) => {
   return axios.get(\`${apiTag}${apiUrl}\`, { ${query !== '' ? 'params: query,' : ''}...config });
}`
        },
        delete () {
            return `
/**
* ${apiOption.description}
* ${description}
* @returns 
*/
export const ${apiName} = (${pathParam} config?: any) => {
   return axios.delete(\`${apiTag}${apiUrl}\`, config);
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
import axios from 'axios';
${apiDtoText}
${apiText}
`;
}
function start () {
    axios.get(url).then((res) => {
        //组织dto文件内容
        const dtoObj = res.data.components.schemas;
        for (let i in dtoObj) {
            const dto = dtoObj[i];
            let filedText = '    _id?: string;';
            for (let j in dto.properties) {
                filedText += getFiled(j, dto.properties[j], dto.required?.includes(j));
            }
            const classText = getClass(i, filedText);
            fs.writeFileSync(`${dtoPath}/${i}Dto.ts`, classText);
        }
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
                apiClassifyDtoList[className][dtoName] = `import type { ${dtoName}Dto } from './dto/${dtoName}Dto';
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
            fs.writeFileSync(`${apiPath}/${i}Api.ts`, apiFileText);
        }

    });
}
clearPath();
start();

