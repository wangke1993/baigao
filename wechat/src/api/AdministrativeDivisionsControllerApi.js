
/**
* 行政区划
*/
import {post,get,del} from '@/utils/request.js';


/**
* 根据区域类型【parentCode】:行政区划的CODE,获取省时传0即可,获取省市区,无需权限校验
* parentCode：parentCode;
* @returns 
*/
export function AdministrativeDivisionsControllerGetListByDicClass(parentCode){
	// query:{} 
   return get(`/admin/administrativeDivisions/getAdministrativeDivisions/${parentCode}`, {});
}
