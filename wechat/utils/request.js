import {
	getToken
} from "@/utils/authToken.js"
// dev：本地开发
export const BASE_URL = 'http://localhost:3001';
// pc：发布pc端
// export const BASE_URL = '/api';
// wechat：正式发布
// export const BASE_URL = 'https://zxsw.domain.cn';
const request = (url, method, data) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			method: method,
			data: data,
			header: {
				Authorization: `Bearer ${getToken()}`
			},
			success: res => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			},
			complete: () => {}
		});
	});
}
export function post(url, data) {
	return request(url, 'POST', data);
}
export function get(url, data) {
	return request(url, 'GET', data);
}
export function del(url, data) {
	return request(url, 'DELETE', data);
}
/**
 * 上传公开文件，无需登录即可查看
 * @param {Object} filePath
 */
export function uploadPublic(filePath) {
	return uploadFile(`${BASE_URL}/file/upload`, filePath);
}
/**
 * 上传保护文件，需要登录才能查看
 * @param {Object} filePath 
 */
export function uploadPrivate(filePath) {
	return uploadFile(`${BASE_URL}/file/uploadPrivate`, filePath);
}
export function getPrivate(url) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			method: 'GET',
			header: {
				Authorization: `Bearer ${getToken()}`,
			},
			responseType: "arraybuffer",
			success: res => {
				resolve(`data:image/jpeg;base64,${uni.arrayBufferToBase64(res.data)}`)
			},
			fail: (err) => {
				reject(err)
			}
		});
	});
}

function uploadFile(url, filePath) {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url,
			filePath,
			name: 'file',
			header: {
				Authorization: `Bearer ${getToken()}`
			},
			success: (res) => {
				resolve(res);
			},
			fail: (res) => {
				reject(res);
			}
		});
	})
};
