export class DataDictionaryDto {

    _id?: string;
    /**
     * 名称
     */
    dicName!: string;
    
    /**
     * 分类：1字典分类，2字典值
     */
    dicType!: sring;
    
    /**
     * 所属分类Code,仅字典值有
     */
    dicClass?: string;
    
    /**
     * 编码：分类(DC0001),值(DC00010001);根据最后添加的一条数据自增
     */
    dicCode?: string;
    
    /**
     * 值
     */
    value?: string;
    
    /**
     * 备注
     */
    remarks?: string;
    
    /**
     * 系统值标识，系统值不能被删除
     */
    isSystem?: boolean;
    
    /**
     * 添加时间
     */
    addDate?: string;
    
}