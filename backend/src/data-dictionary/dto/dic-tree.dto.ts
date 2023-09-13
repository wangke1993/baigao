import { ApiProperty } from "@nestjs/swagger";
import { DIC_TYPE } from "./data-dictionary.schema";

export class DicTree {
    @ApiProperty({
        description: '名称',
    })
    dicName: string;
    @ApiProperty({
        description: '分类：1字典分类，2字典值'
    })
    dicType: DIC_TYPE;
    @ApiProperty({
        required: false,
        description: '所属分类Code,仅字典值有',
    })
    dicClass: string;
    // 编码
    @ApiProperty({
        required: false,
        description: '编码：分类(DC0001),值(DC00010001);根据最后添加的一条数据自增',
    })
    dicCode: string;
    @ApiProperty({
        required: false,
        description: '备注',
    })
    remarks: string;
    @ApiProperty({
        required: false,
        description: '添加时间',
    })
    addDate: Date;
    @ApiProperty({
        required: false,
        description: '系统值标识，系统值不能被删除',
    })
    isSystem: boolean;

    @ApiProperty({
        required: false,
        description: '子节点',
    })
    children: DicTree[] | any;
}