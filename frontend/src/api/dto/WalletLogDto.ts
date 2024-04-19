export class WalletLogDto {

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
     * 文件id数组，只要文章上传文件，保留原有数据且把上传的文件id都push到该数组中。
     */
    fileIds?: string[];
    
    /**
     * 所属钱包
     */
    walletUUID!: string;
    
    /**
     * 金额（分）
     */
    amount!: number;
    
    /**
     * 余额
     */
    balance!: number;
    
    /**
     * 类型
     */
    logType!: string;
    
    /**
     * 类型名称
     */
    logTypeText!: string;
    
    /**
     * 备注
     */
    remarks?: string;
    
    /**
     * 是否退款
     */
    refunded?: boolean;
    
    /**
     * 是否生效
     */
    takeEffect?: boolean;
    
}