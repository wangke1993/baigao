
/**
* 行政区划
*/
import axios from 'axios';


/**
* 根据区域类型【parentCode】:行政区划的CODE,获取省时传0即可,获取省市区,无需权限校验
* parentCode：parentCode;
* @returns 
*/
export const AdministrativeDivisionsControllerGetListByDicClass = (parentCode: string, config?: any) => {
   return axios.get(`/api/admin/administrativeDivisions/getAdministrativeDivisions/${parentCode}`, { ...config });
}
