
/**
* 系统日志
*/
import {post,get,del} from '@/utils/request.js';


/**
* getSystemLogPage:获取系统日志分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：关键字:模块名称/请求路径/操作内容/账号名称;IP：IP;startTime：开始时间;endTime：结束时间;
* @returns 
*/
export function SystemLogControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord,IP,startTime,endTime} 
   return get(`/admin/SystemLog/getPage`, query);
}
