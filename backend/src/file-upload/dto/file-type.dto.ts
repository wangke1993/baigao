const word = ['doc', 'docm', 'docx', 'docxf', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 'fb2', 'htm', 'html', 'mht', 'odt', 'oform', 'ott', 'oxps', 'pdf', 'rtf', 'txt', 'djvu', 'xml', 'xps'];
const cell = ['csv', 'fods', 'ods', 'ots', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx'];
const slide = ['fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx'];
const image = ["jpeg", "png", "gif", "bmp", "jpg"];

/**
 * 根据文件类型判断文件是不是office类型
 * @param fileType 文件类型
 */
export const isOffice = (fileType: string) => {
    return word.includes(fileType) || slide.includes(fileType) || cell.includes(fileType);
}
/**
 * 根据文件类型判断文件是不是图片类型
 * @param fileType 文件类型
 */
export const isImage = (fileType: string) => {
    return image.includes(fileType);
}