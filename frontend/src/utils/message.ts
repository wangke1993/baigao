import { ElMessage, ElMessageBox } from 'element-plus'

export const alertSuccess = (msg: string) => {
    ElMessage({
        message: `${msg}`,
        grouping: true,
        type: 'success',
    })
};

export const alertWarning = (msg: string) => {
    ElMessage({
        message: `${msg}`,
        grouping: true,
        type: 'warning',
    })
};
export const alertError = (msg: string) => {
    ElMessage.error(`${msg}`)
};
export const alertInfo = (msg: string) => {
    ElMessage(`${msg}`)
}
export const alertConfirm = (msg: string) => {
    return ElMessageBox.confirm(msg);
}