
/**
* 文章管理
*/
import {post,get,del} from '@/utils/request.js';
// ArticleMangerDto：./dto/ArticleMangerDto';


/**
* createArticle:创建文章
* 
* @returns 
*/
export function ArticleMangerControllerCreate(ArticleMangerDto){
   return post(`/article/create`, ArticleMangerDto);
}
/**
* updateArticle:编辑文章
* id：id;
* @returns 
*/
export function ArticleMangerControllerUpdate(id,ArticleMangerDto){
   return post(`/article/update/${id}`, ArticleMangerDto);
}
/**
* getDetailByArticleId:根据id获取文章详情，以发布和未发布的均可获取
* id：id;
* @returns 
*/
export function ArticleMangerControllerGetDetailByArticleId(id){
	// query:{} 
   return get(`/article/getDetail/${id}`, {});
}
/**
* 根据id获取文章详情，仅可获取已发布的文章详情，无需登录
* id：id;
* @returns 
*/
export function ArticleMangerControllerGetReleaseDetailByArticleId(id){
	// query:{} 
   return get(`/article/getReleaseDetail/${id}`, {});
}
/**
* deleteArticle:删除文章
* id：id;
* @returns 
*/
export function ArticleMangerControllerDelete(id ){
   return del(`/article/delete/${id}`);
}
             
/**
* getArticlePage:获取文章分页
* pageSize：单页显示条数;pageIndex：当前页码;keyWord：搜索关键字;articleClass：所属分类，取字典管理中：DC0001的值;isRelease：发布状态，0全部，1已发布，2未发布;
* @returns 
*/
export function ArticleMangerControllerGetPage(query){
	// query:{pageSize,pageIndex,keyWord,articleClass,isRelease} 
   return get(`/article/getPage`, query);
}
