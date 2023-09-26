
/**
* 系统日志
*/
import axios from 'axios';


/**
* getSystemLogPage:获取系统日志分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：关键字:模块名称/请求路径/操作内容/账号名称;IP：IP;startTime：开始时间;endTime：结束时间;
* @returns 
*/
export const SystemLogControllerGetPage = (query: { pageSize: string,pageIndex: string,keyWord: string,IP: string,startTime: string,endTime: string }, config?: any) => {
   return axios.get(`/api/admin/SystemLog/getPage`, { params: query,...config });
}
