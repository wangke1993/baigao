
/**
* 任务测试
*/
import {post,get,del} from '@/utils/request.js';


/**
* 测试延时队列
* s：s;
* @returns 
*/
export function TaskTestControllerCreate(s){
	// query:{} 
   return get(`/taskTest/test/${s}`, {});
}
