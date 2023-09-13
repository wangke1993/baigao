export class SystemConfigPage {
    group: ConfigGroup[]
}
export class ConfigGroup {
    /**
     * 分组名称
     */
    name: string;
    /**
     * 分组说明
     */
    description: string;
    /**
     * 分组链接
     */
    linkArr: GroupLink[];
    /**
     * 配置项
     */
    configItem: ConfigGroupItem[];
    /**
     * 排序，降序
     */
    sortAsc: number;
}
export class ConfigGroupItem {
    /**
     * 配置字典类型
     */
    confType: string;
    /**
     * 配置选项字典值
     */
    confSelect: string;
    /**
     * 配置名称，默认为confSelect名称
     */
    labelName: string;
    /**
     * 是否允许查看,实现允许设置不允许查看
     */
    allowFetch: boolean;
    /**
     * 是否公开，不用权限即可使用
     */
    isOpen: boolean;
    /**
     * 配置说明
     */
    description: string;
    /**
     * 绑定dom
     */
    dom: CONFIG_DOM | string;
    /**
     * 绑定dom获取配置URL
     */
    dataUrl: string;
    /**
     * 排序降序
     */
    sortAsc?: number;
    /**
    * 默认值
    */
    defaultValue?: string;
}
export class GroupLink {
    /**
     * 分组链接名称
     */
    linkName: string;
    /**
     * 分组跳转链接
     */
    linkUrl: string;
}
enum CONFIG_DOM {
    '单行文本' = 'Input',
    '密码' = 'Password',
    '多行' = 'Area',
    '开关' = 'Swatch',
    '单选下拉' = 'Select',
    '多选下拉' = 'MoreSelect',
    '富文本' = 'MoreText',
    '附件' = 'File',
    '图片' = 'Image',
}
export const SYSTEM_PAGE_CONFIG = "DC00000001";