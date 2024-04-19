
/**
* 文件管理
*/
import axios from 'axios';


/**
* 文件上传公开文件，无需登录
* 
* @returns 
*/
export const FileUploadControllerUpload = (file: File, config?: any) => {
   const form = new FormData();
   form.append('file', file)
   return axios.post(`/api/file/upload`, form, config);
}
/**
* uploadPrivate:上传私有文件，仅登录后可以查看
* 
* @returns 
*/
export const FileUploadControllerUploadPrivate = (file: File, config?: any) => {
   const form = new FormData();
   form.append('file', file)
   return axios.post(`/api/file/uploadPrivate`, form, config);
}
/**
* getPrivateFile:获取私有文件，需要登录以后才能使用
* fileUUID：fileUUID;
* @returns 
*/
export const FileUploadControllerGetPrivateFile = (fileUUID: string, config?: any) => {
   return axios.get(`/api/file/private/${fileUUID}`, { ...config });
}
/**
* 获取临时开放私有文件
* viewUUID：viewUUID;
* @returns 
*/
export const FileUploadControllerGetPrivateFileTemp = (viewUUID: string, config?: any) => {
   return axios.get(`/api/file/privateTemp/${viewUUID}`, { ...config });
}
/**
* downPrivateTemp:下载私有文件,office类型的数据生成临时开放数据,30分钟过期
* fileUUID：fileUUID;
* @returns 
*/
export const FileUploadControllerDownPrivateTemp = (fileUUID: string, config?: any) => {
   return axios.get(`/api/file/downPrivateTemp/${fileUUID}`, { ...config });
}
/**
* downPrivate:下载私有文件
* fileUUID：fileUUID;
* @returns 
*/
export const FileUploadControllerDownPrivate = (fileUUID: string, config?: any) => {
   return axios.get(`/api/file/downPrivate/${fileUUID}`, { ...config });
}
/**
* deleteFile:删除文件
* id：id;
* @returns 
*/
export const FileUploadControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/file/delete/${id}`, config);
}
             
/**
* getFileManagementPage:获取文件管理分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;
* @returns 
*/
export const FileUploadControllerGetPage = (query: { pageSize: number,pageIndex: number,keyWord: string }, config?: any) => {
   return axios.get(`/api/file/getPage`, { params: query,...config });
}
