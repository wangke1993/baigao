export class WalletManagementDto {

    _id?: string;
    /**
     * 最后更新用户
     */
    addUser?: string;
    
    /**
     * 添加时间
     */
    addDate?: string;
    
    /**
     * 最后更新用户
     */
    updateUser?: string;
    
    /**
     * 最后更新时间
     */
    updateDate?: string;
    
    /**
     * 文件UUID数组，只要文章上传文件，保留原有数据且把上传的文件UUID都push到该数组中。
     */
    fileIds?: string[];
    
    /**
     * UUID
     */
    UUID?: string;
    
    /**
     * 所属用户,会员UUID or 员工UUID
     */
    bindUserUUID!: string;
    
    /**
     * 余额（分）
     */
    balance?: number;
    
    /**
     * 总收入（分）
     */
    totalIncome?: number;
    
    /**
     * 总支出（分）
     */
    totalExpenditure?: number;
    
    /**
     * 备注
     */
    remarks?: string;
    
    /**
     * 冻结
     */
    freeze?: boolean;
    
}