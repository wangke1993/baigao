import { decode } from 'base64-arraybuffer';
import { decode as decodeUtf8 } from 'utf8';

const TOKEN_STORAGE_KEY = 'bg_admin_token';
/**
   * ArrayBuffer转字符串
   * @param {ArrayBuffer} e 需要转换的ArrayBuffer类型数值
   * @param {function} t 转换成功后的回调
   */
const getUint8Value = (e: ArrayBuffer) => {
    let n = '';
    for (let a = e, i = new DataView(a), s = 0; s < i.byteLength; s++) {
        n += String.fromCharCode(i.getUint8(s));
    }
    return n;
}
//存储token
export const saveToken = (token: string) => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}
//获取token
export const getToken = () => {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}
//删除token
export const deleteToken = () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}
//验证token是否过期
export const tokenIsOk = () => {
    const token = getToken();
    if (token) {
        const now = Date.now() / 1000;
        const exp = JSON.parse(getUint8Value(decode(token.split('.')[1]))).exp;
        if (now <= exp) {
            return true;
        }
        deleteToken();
    }
    return false;
}
//获取token用户信息
export const getUserInfoByToken = () => {
    const token = getToken();
    if (token) {
        const userInfoByBase64 = getUint8Value(decode(JSON.parse(getUint8Value(decode(token.split('.')[1]))).userInfo));
        return JSON.parse(decodeUtf8(userInfoByBase64));
    }
    return;
}
