import { ElMessageBox } from 'element-plus'

export const confirm = (msg: String, callBack: any) => {
  ElMessageBox.confirm(`${msg}`).then(() => {
   callBack()
  }).catch(() => {
    // catch error
  })
};