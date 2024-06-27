const xml2js = require('xml2js');
export const js2xml = (data: any) => {
    const builder = new xml2js.Builder();
    return builder.buildObject({ xml: data }).replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
}

/**
 * 去除非utf-8字符串
 * @param inputString 
 * @returns 
 */
export const removeNonUtf8Chars = (inputString: string) => {
    // 将字符串转换为 Uint8Array 类型的字节数组
    const bytes = new TextEncoder().encode(inputString);

    // 过滤出合法的 UTF-8 字节序列
    const filteredBytes = [];
    let i = 0;
    while (i < bytes.length) {
        if (bytes[i] <= 0x7F) { // 单字节 UTF-8 字符
            filteredBytes.push(bytes[i]);
            i += 1;
        } else if ((bytes[i] & 0xE0) === 0xC0) { // 2 字节 UTF-8 字符
            filteredBytes.push(bytes[i], bytes[i + 1]);
            i += 2;
        } else if ((bytes[i] & 0xF0) === 0xE0) { // 3 字节 UTF-8 字符
            filteredBytes.push(bytes[i], bytes[i + 1], bytes[i + 2]);
            i += 3;
        } else { // 非 UTF-8 字符
            i += 1; // 跳过非 UTF-8 字符
        }
    }

    // 将过滤后的字节数组转换回字符串
    const replacedString = new TextDecoder().decode(Uint8Array.from(filteredBytes));
    return replacedString;
}