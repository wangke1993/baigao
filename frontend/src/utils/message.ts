import { ElMessage, ElMessageBox } from 'element-plus'

export const alertSuccess = (msg: String) => {
    ElMessage({
        message: `${msg}`,
        type: 'success',
    })
};

export const alertWarning = (msg: String) => {
    ElMessage({
        message: `${msg}`,
        type: 'warning',
    })
};
export const alertError = (msg: String) => {
    ElMessage.error(`${msg}`)
};
export const alertInfo = (msg: String) => {
    ElMessage(`${msg}`)
}
export const alertConfirm = (msg: string) => {
    return ElMessageBox.confirm(msg);
}