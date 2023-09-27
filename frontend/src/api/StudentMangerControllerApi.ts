
/**
* 学生管理模块
*/
import axios from 'axios';
import type { StudentMangerDto } from './dto/StudentMangerDto';


/**
* createStudentManger:创建学生管理模块
*/
export const StudentMangerControllerCreate = (data: StudentMangerDto, config?: any) => {
   return axios.post(`/api/studentManger/create`, data, config);
}

/**
* updateStudentManger:编辑学生管理模块
*/
export const StudentMangerControllerUpdate = (id: string,data: StudentMangerDto, config?: any) => {
   return axios.post(`/api/studentManger/update/${id}`, data, config);
}

/**
* getDetailByStudentMangerId:根据id获取学生管理模块详情，以发布和未发布的均可获取
*/
export const StudentMangerControllerGetDetailById = (id: string, config?: any) => {
   return axios.get(`/api/studentManger/getDetail/${id}`, { ...config });
}

/**
* deleteStudentManger:删除学生管理模块
*/
export const StudentMangerControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/studentManger/delete/${id}`, config);
}
             
/**
* getStudentMangerPage:获取学生管理模块分页
*/
export const StudentMangerControllerGetPage = (query: { pageSize: number,pageIndex: number,keyWord: string,  name:string, }, config?: any) => {
   return axios.get(`/api/studentManger/getPage`, { params: query,...config });
}
