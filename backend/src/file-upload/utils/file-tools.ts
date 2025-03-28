import { existsSync, lstatSync, mkdirSync, readdirSync, rm, rmdirSync, statSync, unlinkSync, writeFile, writeFileSync } from "fs";
import { FILE_TYPE } from "../dto/file-upload.schema";
import { Logger } from "@nestjs/common";
import { join } from 'path';
import * as sharp from 'sharp';
const logger = new Logger('fileTools');
enum ROOT_DIR {
    'public' = 'public',
    'private' = 'private',
}
export const saveFile = async (file: any, UUID: string, isPrivate: boolean = false) => {
    const rootPath = getFileSavePath(getFileType(chargeFileNameCode(file.originalname)), isPrivate);
    const path = `${rootPath}/${UUID}_${chargeFileNameCode(file.originalname)}`;
    let fileBuff = file.buffer;
    if (isJpg(file.originalname)) {
        // 所有jpg图片都进行压缩
        fileBuff = await sharp(file.buffer)
            .jpeg({ quality: 50 }) // 指定 JPEG 压缩质量
            .toBuffer();
    }
    writeFileSync(path, fileBuff);
    return path;
}
export const saveFileByBuffer = (fileName: any, buffer: string | NodeJS.ArrayBufferView, UUID: string, isPrivate: boolean = false) => {
    return new Promise(function (resolve, reject) {
        const rootPath = getFileSavePath(getFileType(fileName), isPrivate);
        const path = `${rootPath}/${UUID}`;
        writeFile(path, buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(path);
            }
        });
    });
}
export const chargeFileNameCode = (fileName: string) => {
    return Buffer.from(fileName, 'latin1').toString('utf-8');
}
export const getFileUrl = (fileName: string, UUID: string, fileType: number, isPrivate: boolean = false) => {
    const path = ['image', 'video', 'audio', 'doc', 'software', 'GZIP', 'other'];
    if (isPrivate) {
        return `/file/private/${UUID}`
    } else {
        return `/${path[fileType - 1]}/${UUID}_${fileName}`
    }
}
export const deleteFile = (path: string) => {
    return new Promise(function (resolve, reject) {
        // 判断文件是否存在
        if (existsSync(path)) {
            // rm(path, (err) => {
            //     if (err) {
            //         reject(err);
            //     } else {
            //         resolve(true);
            //     }
            // });
            unlinkSync(path);
            resolve(true);
        } else {
            logger.error('文件不存在', path);
            resolve(false);
        }
    });
}
export const createUploadDir = async () => {
    const path = ['image', 'video', 'audio', 'doc', 'software', 'GZIP', 'other'];
    existsSync(`./${ROOT_DIR.public}`) || mkdirSync(`./${ROOT_DIR.public}`);
    existsSync(`./${ROOT_DIR.private}`) || mkdirSync(`./${ROOT_DIR.private}`);
    path.forEach(p => {
        existsSync(`./${ROOT_DIR.public}/${p}`) || mkdirSync(`./${ROOT_DIR.public}/${p}`);
        existsSync(`./${ROOT_DIR.private}/${p}`) || mkdirSync(`./${ROOT_DIR.private}/${p}`);
    });
}
export const getFileSavePath = (fileType: FILE_TYPE, isPrivate: boolean = false) => {
    const path = ['image', 'video', 'audio', 'doc', 'software', 'GZIP', 'other'];
    if (isPrivate) {
        return `./${ROOT_DIR.private}/${path[fileType - 1]}`
    } else {
        return `./${ROOT_DIR.public}/${path[fileType - 1]}`
    }
}
export const getFileType = (fileName: string) => {
    const tempArr = fileName?.split('.')
    const suffix = tempArr[tempArr.length - 1]?.toLocaleLowerCase();
    if (!suffix) {
        return FILE_TYPE.other;
    }
    const img = ['bmp', 'jpg', 'png', 'tif', 'gif', 'jpeg'];
    if (img.includes(suffix)) {
        return FILE_TYPE.img;
    }
    const video = ['mp4', '3gp', 'avi', 'flv', 'rmvb', 'mpeg', 'wmv', 'asf', 'asx', 'rm', 'mpg', 'mpe', 'mov', 'm4v'];
    if (video.includes(suffix)) {
        return FILE_TYPE.video;
    }
    const audio = ['mp3', 'wave', 'wma', 'aac'];
    if (audio.includes(suffix)) {
        return FILE_TYPE.audio;
    }
    const doc = ['txt', 'doc', 'pdf', 'ppt', 'xls', 'xlsx'];
    if (doc.includes(suffix)) {
        return FILE_TYPE.doc;
    }
    const software = ['apk', 'exe', 'msi', 'pkg', 'ipa'];
    if (software.includes(suffix)) {
        return FILE_TYPE.software;
    }
    const GZIP = ['7z', 'zip', 'rar'];
    if (GZIP.includes(suffix)) {
        return FILE_TYPE.GZIP;
    }
    return FILE_TYPE.other;
}
export const isJpg = (fileName: string) => {
    const tempArr = fileName?.split('.')
    const suffix = tempArr[tempArr.length - 1]?.toLocaleLowerCase();
    const img = ['jpg', 'jpeg'];
    return img.includes(suffix)
}
/**
 * 递归删除文件夹
 * @param folderPath 
 */
export const deleteFolderRecursive = (folderPath: string) => {
    if (!existsSync(folderPath)) {
        return;
    }
    if (!statSync(folderPath).isDirectory()) {
        unlinkSync(folderPath);
    }
    if (existsSync(folderPath)) {
        readdirSync(folderPath).forEach((file) => {
            const curPath = join(folderPath, file);
            if (lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                unlinkSync(curPath);
            }
        });
        rmdirSync(folderPath);
    }
}