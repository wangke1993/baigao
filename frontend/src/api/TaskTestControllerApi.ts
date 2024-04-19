
/**
* 任务测试
*/
import axios from 'axios';


/**
* 测试延时队列
* s：s;
* @returns 
*/
export const TaskTestControllerCreate = (s: number, config?: any) => {
   return axios.get(`/api/taskTest/test/${s}`, { ...config });
}
