/* eslint-disable */
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import router from '@/router'
import { getToken, tokenIsOk } from './authTokenUtil';
import { alertWarning } from './message';

axios.defaults.timeout = 20000;
axios.interceptors.request.use((requestConfig: AxiosRequestConfig) => {
    requestConfig.headers = { Authorization: `Bearer ${getToken()}` };
    return requestConfig;
}, (error) => {
    return Promise.reject(error);
});
// 请求到结果的拦截处理
axios.interceptors.response.use((response: AxiosResponse) => {
    if (response.status === 401) {
        //提示+重定向判断
        if (tokenIsOk()) {
            alertWarning('无权访问当前接口，请联系管理员分配');
        } else {
            alertWarning('登录过期，请重新登录');
            router.push(`/login?redirect=${window.location.pathname}${window.location.search}${window.location.hash}`);
        }
    }
    return response;
}, (error) => {
    return Promise.reject(error);
});
export async function getPrivateFile(url: string) {
    console.log('获取私有文件', url)
    if (url && url != 'undefined') {
        const { data: res } = await axios.get(`/api${url}`, { responseType: 'blob' });
        return URL.createObjectURL(res)
    } else {
        return ''
    }
}
