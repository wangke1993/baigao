import {
	decode
} from 'base64-arraybuffer';
import {
	decode as decodeUtf8
} from 'utf8';
import {
	userLoginOpenIdState
} from '@/utils/state.js';

const TOKEN_STORAGE_KEY = 'BG_WECHAT_TOKEN';
const TOKEN_USER_INFO = 'BG_TOKEN_USER_INFO';
/**
 * ArrayBuffer转字符串
 */
function getUint8Value(e) {
	let n = '';
	for (let a = e, i = new DataView(a), s = 0; s < i.byteLength; s++) {
		n += String.fromCharCode(i.getUint8(s));
	}
	return n;
}

//存储token
export function saveToken(token) {
	// #ifdef MP-WEIXIN
	uni.setStorageSync(TOKEN_STORAGE_KEY, token);
	// #endif
	// #ifdef H5
	window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
	// #endif
	const userInfo = getUserInfoByToken();
	setUserInfoByStorage(userInfo);
	userLoginOpenIdState.set(userInfo.openId);
}
//获取token
export function getToken() {
	// #ifdef MP-WEIXIN
	return uni.getStorageSync(TOKEN_STORAGE_KEY);
	// #endif
	// #ifdef H5
	return window.sessionStorage.getItem(TOKEN_STORAGE_KEY)
	// #endif
}
//删除token
export function deleteToken() {
	// #ifdef MP-WEIXIN
	uni.removeStorageSync(TOKEN_STORAGE_KEY);
	// #endif
	// #ifdef H5
	window.sessionStorage.removeItem(TOKEN_STORAGE_KEY)
	// #endif
	deleteUserInfoByStorage();
}
//验证token是否过期
export function tokenIsOk() {
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
//是否绑定手机号
export function phoneIsBind() {
	const userInfo = getUserInfoByStorage();
	if(userInfo?.phoneNumber){
		return true;
	}else{
		return false;
	}
}
//获取token用户信息
export function getUserInfoByToken() {
	const token = getToken();
	if (token) {
		const userInfoByBase64 = getUint8Value(decode(JSON.parse(getUint8Value(decode(token.split('.')[1]))).userInfo));
		return JSON.parse(decodeUtf8(userInfoByBase64));
	}
	return;
}
//获取token用户信息
export function getUserInfoByStorage() {
	// #ifdef MP-WEIXIN
	const userInfoString = uni.getStorageSync(TOKEN_USER_INFO);
	// #endif
	if (userInfoString) {
		return JSON.parse(userInfoString);
	} else {
		return userInfoString;
	}
}
// 设置用户信息
export function setUserInfoByStorage(userInfo) {
	if (userInfo) {
		// #ifdef MP-WEIXIN
		uni.setStorageSync(TOKEN_USER_INFO, JSON.stringify(userInfo));
		// #endif
		// #ifdef H5
		window.sessionStorage.setItem(TOKEN_USER_INFO, JSON.stringify(userInfo));
		// #endif
	}
}
// 删除用户信息
export function deleteUserInfoByStorage() {
	// #ifdef MP-WEIXIN
	uni.removeStorageSync(TOKEN_USER_INFO);
	// #endif
	// #ifdef H5
	window.sessionStorage.removeItem(TOKEN_USER_INFO);
	// #endif
}
