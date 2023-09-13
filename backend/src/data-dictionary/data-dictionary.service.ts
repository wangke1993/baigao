import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";
import { Model } from 'mongoose';
import { PageRequestDto } from 'src/common-dto/page-request.dto';
import { PageResponseDto } from 'src/common-dto/page-response.dto';
import { DataDictionary, DataDictionaryDocument, DIC_TYPE } from './dto/data-dictionary.schema';
import { DicTree } from './dto/dic-tree.dto';

@Injectable()
export class DataDictionaryService {

    constructor(@InjectModel(DataDictionary.name) private DataDictionaryModel: Model<DataDictionaryDocument>) { };


    async deleteByCode(dicCode: string): Promise<any> {
        return this.DataDictionaryModel.deleteMany({
            $or: [
                { dicCode: dicCode },
                { dicClass: dicCode }
            ],
            isSystem: false
        });
    }
    async create(dataDictionary: DataDictionary): Promise<DataDictionary> {
        /**
         * 生成字典编码
         * 1.获取最后一位字典编码
         * 2.最后一位字典编码后四+1；
         */
        let lastDic: any;
        if (dataDictionary.dicType == DIC_TYPE.class) {
            lastDic = await this.DataDictionaryModel.find({
                dicType: dataDictionary.dicType
            }).limit(1).sort({ addDate: -1 });
            if (lastDic.length > 0) {
                let lastDicNumber = Number(lastDic[0].dicCode.substring(2, lastDic[0].dicCode.length));
                lastDicNumber += 1;
                const code = lastDicNumber.toString();
                dataDictionary.dicCode = `DC${code.padStart(4, '0')}`;
            } else {
                dataDictionary.dicCode = 'DC0001';
            }
        } else if (dataDictionary.dicType == DIC_TYPE.value) {
            lastDic = await this.DataDictionaryModel.find({
                dicType: dataDictionary.dicType,
                dicClass: dataDictionary.dicClass
            }).limit(1).sort({ addDate: -1 });
            if (lastDic.length > 0) {
                let lastDicNumber = Number(lastDic[0].dicCode.substring(6, lastDic[0].dicCode.length));
                lastDicNumber += 1;
                const code = lastDicNumber.toString();
                dataDictionary.dicCode = `${dataDictionary.dicClass}${code.padStart(4, '0')}`;
            } else {
                dataDictionary.dicCode = `${dataDictionary.dicClass}0001`;
            }
        } else {
            throw new Error("请填写正确的dicType");
        }
        dataDictionary.addDate = new Date();
        dataDictionary.isSystem = false;
        return new this.DataDictionaryModel(dataDictionary).save();
    }
    async update(dataDictionary: DataDictionary, id: string): Promise<any> {
        if (dataDictionary.dicType == DIC_TYPE.class || dataDictionary.dicType == DIC_TYPE.value) {
            delete dataDictionary.dicCode;
            delete dataDictionary.dicType;
            delete dataDictionary.isSystem;
            return await this.DataDictionaryModel.updateOne({ _id: new ObjectId(id) }, { $set: { ...dataDictionary } });
        } else {
            throw new Error("请填写正确的dicType");
        }
    }
    async getPage(pageForm: PageRequestDto, dicType: number, dicClass?: string): Promise<PageResponseDto<DataDictionary>> {
        const keyWord = pageForm?.keyWord ? pageForm?.keyWord : '';
        let map: any = {
            $or: [
                { dicName: { $regex: keyWord } }
            ],
            dicType: dicType
        };
        if (dicClass) {
            map = {
                $or: [
                    { dicName: { $regex: keyWord } }
                ],
                dicType: dicType,
                dicClass: dicClass
            };
        }
        const pageData = new PageResponseDto<DataDictionary>();
        pageData.total = await this.DataDictionaryModel.countDocuments(map);
        pageData.list = await this.DataDictionaryModel.find(map).limit(pageForm.pageSize).skip((pageForm.pageIndex - 1) * pageForm.pageSize);
        return pageData;
    }
    async getListByDicClass(dicClass: string): Promise<DataDictionary[]> {
        let map: any = {
            dicClass: dicClass
        };
        return await this.DataDictionaryModel.find(map).sort({ addDate: 1 });
    }
    async getTree(): Promise<DicTree[]> {
        const List = await this.DataDictionaryModel.find().sort({ dicCode: 1 });
        const top = List.filter(item => item.dicType == DIC_TYPE.class);
        const dicTree: DicTree[] = [];
        top.forEach(item => {
            dicTree.push({
                ...item['_doc'],
                children: List.filter(child => child.dicType == DIC_TYPE.value && child.dicClass == item.dicCode)
            })
        })
        return dicTree
    }
}
