
/**
* 文件管理
*/
import {post,get,del} from '@/utils/request.js';


/**
* 文件上传公开文件，无需登录
* 
* @returns 
*/
export function FileUploadControllerUpload(file){
   const files = [file];
   const name = 'file';
   return uni.uploadFile(`/file/upload`, {files,name});
}
/**
* uploadPrivate:上传私有文件，仅登录后可以查看
* 
* @returns 
*/
export function FileUploadControllerUploadPrivate(file){
   const files = [file];
   const name = 'file';
   return uni.uploadFile(`/file/uploadPrivate`, {files,name});
}
/**
* getPrivateFile:获取私有文件，需要登录以后才能使用
* fileUUID：fileUUID;
* @returns 
*/
export function FileUploadControllerGetPrivateFile(fileUUID){
	// query:{} 
   return get(`/file/private/${fileUUID}`, {});
}
/**
* 获取临时开放私有文件
* viewUUID：viewUUID;
* @returns 
*/
export function FileUploadControllerGetPrivateFileTemp(viewUUID){
	// query:{} 
   return get(`/file/privateTemp/${viewUUID}`, {});
}
/**
* downPrivateTemp:下载私有文件,office类型的数据生成临时开放数据,30分钟过期
* fileUUID：fileUUID;
* @returns 
*/
export function FileUploadControllerDownPrivateTemp(fileUUID){
	// query:{} 
   return get(`/file/downPrivateTemp/${fileUUID}`, {});
}
/**
* downPrivate:下载私有文件
* fileUUID：fileUUID;
* @returns 
*/
export function FileUploadControllerDownPrivate(fileUUID){
	// query:{} 
   return get(`/file/downPrivate/${fileUUID}`, {});
}
/**
* deleteFile:删除文件
* id：id;
* @returns 
*/
export function FileUploadControllerDelete(id ){
   return del(`/file/delete/${id}`);
}
             
/**
* getFileMangerPage:获取文件管理分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;
* @returns 
*/
export function FileUploadControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord} 
   return get(`/file/getPage`, query);
}
