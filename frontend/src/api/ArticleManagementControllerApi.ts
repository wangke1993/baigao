
/**
* 文章管理
*/
import axios from 'axios';
import type { ArticleManagementDto } from './dto/ArticleManagementDto';


/**
* createArticle:创建文章
* 
* @returns 
*/
export const ArticleManagementControllerCreate = (data: ArticleManagementDto, config?: any) => {
   return axios.post(`/api/article/create`, data, config);
}
/**
* updateArticle:编辑文章
* id：id;
* @returns 
*/
export const ArticleManagementControllerUpdate = (id: string,data: ArticleManagementDto, config?: any) => {
   return axios.post(`/api/article/update/${id}`, data, config);
}
/**
* getDetailByArticleId:根据id获取文章详情，以发布和未发布的均可获取
* id：id;
* @returns 
*/
export const ArticleManagementControllerGetDetailByArticleId = (id: string, config?: any) => {
   return axios.get(`/api/article/getDetail/${id}`, { ...config });
}
/**
* 根据id获取文章详情，仅可获取已发布的文章详情，无需登录
* id：id;
* @returns 
*/
export const ArticleManagementControllerGetReleaseDetailByArticleId = (id: string, config?: any) => {
   return axios.get(`/api/article/getReleaseDetail/${id}`, { ...config });
}
/**
* deleteArticle:删除文章
* id：id;
* @returns 
*/
export const ArticleManagementControllerDelete = (id: string, config?: any) => {
   return axios.delete(`/api/article/delete/${id}`, config);
}
             
/**
* getArticlePage:获取文章分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;articleClass：所属分类，取字典管理中：DC0001的值;isRelease：发布状态，0全部，1已发布，2未发布;
* @returns 
*/
export const ArticleManagementControllerGetPage = (query: { pageSize: number,pageIndex: number,keyWord: string,articleClass: string,isRelease: number }, config?: any) => {
   return axios.get(`/api/article/getPage`, { params: query,...config });
}
/**
* getArticleList:获取文章列表
* articleClass：articleClass;count：count;
* @returns 
*/
export const ArticleManagementControllerGetArticleList = (articleClass: string,count: number, config?: any) => {
   return axios.get(`/api/article/getList/${articleClass}/${count}`, { ...config });
}
/**
* getArticleAll:获取所有已发布文章列表
* 
* @returns 
*/
export const ArticleManagementControllerGetArticleAll = ( config?: any) => {
   return axios.get(`/api/article/getAll`, { ...config });
}
