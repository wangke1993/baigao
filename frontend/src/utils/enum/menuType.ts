// 1菜单，2按钮操作，3交互接口
export enum MENU_TYPE {
    menu = 1,
    buttonActive = 2,
    api = 3,
}
export const MENU_TYPE_TRANSLATE = {
    1: '菜单',
    2: '按钮',
    3: '接口'
}
export const MENU_TYPE_TRANSLATE_COLOR = {
    1: '#606266',
    2: '#409eff',
    3: '#67C23A'
}
export const MENU_TYPE_TRANSLATE_NO_MENU = {
    2: '按钮',
    3: '接口'
}