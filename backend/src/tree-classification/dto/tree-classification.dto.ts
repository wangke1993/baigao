import { ApiProperty } from "@nestjs/swagger";
import { BaseDTO } from "src/common-dto/base.dto";
import { TreeClassification } from "./tree-classification.schema";

export class TreeClassificationDto extends BaseDTO {

    constructor(treeClassification: TreeClassification) {
        super();
        this._id = treeClassification._id;
        this.UUID = treeClassification.UUID;
        this.name = treeClassification.name;
        this.parent = treeClassification.parent;
        this.sort = treeClassification.sort;
        this.breathCount = treeClassification.breathCount;
        this.remarks = treeClassification.remarks;
        this.dataClass = treeClassification.dataClass;
        this.administrativeDivision = treeClassification.administrativeDivision;
        this.administrativeDivisionName = treeClassification.administrativeDivisionName;
        this.isOpen = treeClassification.isOpen;
    }
    @ApiProperty({
        description: 'id',
    })
    _id: string;
    @ApiProperty({
        description: 'UUID',
    })
    UUID: string;
    @ApiProperty({
        description: '名称',
    })
    name: string;

    @ApiProperty({
        description: '上级,为0时则为1级',
    })
    parent: string;

    @ApiProperty({
        description: '排序',
    })
    sort: number;
    @ApiProperty({
        description: '兄弟节点数量',
    })
    breathCount: number;

    @ApiProperty({
        description: '备注',
    })
    remarks: String;
    @ApiProperty({
        description: '数据分类：存储数据字典值',
    })
    dataClass: String;
    @ApiProperty({
        description: '行政区划',
    })
    administrativeDivision: String;
    @ApiProperty({
        description: '行政区划名称',
    })
    administrativeDivisionName: String;
    @ApiProperty({
        description: '是否启用',
    })
    isOpen: Boolean;
    @ApiProperty({
        description: '孩子节点',
    })
    children: TreeClassificationDto[];
}