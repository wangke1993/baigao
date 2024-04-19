export class TaskDto<T> {
    // 命令标识
    tag: String; 
    data: T;
    message: String;
}