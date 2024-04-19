import { alertSuccess } from "./message";
import { DateTime } from "luxon";

export const copyString = (str: string | any) => {
    navigator.clipboard.writeText(str).then(() => {
        alertSuccess('已复制');
    }).catch(err => {
        console.error("无法复制文本到剪贴板:", err);
    });
}
export const initialLowercase = (keyWord: string) => {
    if (!keyWord) {
        throw new Error("keyWord不能为空");
    }
    // 长度大于1且第二个字母不为大写
    if (keyWord.length > 1 && !(keyWord.slice(1, 2) >= 'A' && keyWord.slice(1, 2) <= 'Z')) {
        keyWord = keyWord.slice(0, 1).toLocaleLowerCase() + keyWord.slice(1);
    }
    return keyWord;
}
export const initialLocaleUpper = (keyWord: string) => {
    if (!keyWord) {
        throw new Error("keyWord不能为空");
    }
    keyWord = keyWord.slice(0, 1).toLocaleUpperCase() + keyWord.slice(1);
    return keyWord;
}
/**
 * 系统中上传文件存储值，获取图片url
 * @param sysPath 
 */
export const getImagePath = (sysPath: string) => {
    // 文件名称,文件路径;
    return sysPath.split(',').pop()?.replace(';', '');
}
/**
 * 时间日期格式化
 * @param date 
 * @param format 
 * @returns 
 */
export const formatDate = (date: any, format = "yyyy-MM-dd HH:mm:ss") => {
    if (!date) {
        return '';
    }
    if (typeof date != "string") {
        console.log({ date });
        if (!isNaN(date)) {
            date = date.toISOString();
        }
    }
    return DateTime.fromISO(date, { zone: "utc+8" }).toFormat(format);
};