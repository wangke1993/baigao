import { alertSuccess } from "./message";

export const copyString = (str: string | any) => {
    navigator.clipboard.writeText(str).then(() => {
        alertSuccess('已复制');
    }).catch(err => {
        console.error("无法复制文本到剪贴板:", err);
    });
}