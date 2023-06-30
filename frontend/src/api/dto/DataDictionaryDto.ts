export class DataDictionaryDto {

    /**
     * 名称
     */
    dicName!: String;
    
    /**
     * 分类：1字典分类，2字典值
     */
    dicType!: String;
    
    /**
     * 所属分类Code,仅字典值有
     */
    dicClass?: String;
    
    /**
     * 编码：分类(DC0001),值(DC00010001);根据最后添加的一条数据自增
     */
    dicCode?: String;
    
    /**
     * 备注
     */
    remarks?: String;
    
    /**
     * 添加时间
     */
    addDate?: String;
    
    /**
     * 系统值标识，系统值不能被删除
     */
    isSystem?: boolean;
    
}