<template>
  <div>
    <div style="margin-top: 20px" v-if="moduleForm.UUID">
      <h3 style="margin-bottom: 20px">搜索配置</h3>
      <el-button type="primary" @click="addSearch">新增</el-button>
      <el-table
        v-loading="searchListLoading"
        :data="moduleSearchList"
        style="width: 100%"
      >
        <el-table-column label="绑定字段" prop="fieldUUID">
          <template #default="scope">
            <el-select
              v-model="scope.row.fieldUUID"
              placeholder="请选择绑定字段"
              @change="(v: string) => searchFieldChange(v,scope.row)"
            >
              <el-option
                v-for="item in moduleFieldList"
                :key="item.UUID"
                :label="item.name"
                :value="item.UUID"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="检索方式" prop="method">
          <template #default="scope">
            <el-select v-model="scope.row.method" placeholder="请选择检索方式">
              <el-option
                v-for="item in methodConf"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="展示组件" prop="dom">
          <template #default="scope">
            <el-select v-model="scope.row.dom" placeholder="请选择展示组件">
              <el-option
                v-for="item in domType"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button
              v-if="domType.filter((d) => d.value == scope.row.dom)[0].needData"
              @click="openDataSource(scope.row)"
              type="text"
              >配置数据源</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="自动检索" prop="isAuto">
          <template #default="scope">
            <el-switch v-model="scope.row.isAuto" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <div>
              <div class="edit" v-if="scope.row._id">
                <el-button
                  type="primary"
                  v-loading="searchListSaveLoading === scope.$index"
                  @click="saveSearch(scope.row, scope.$index)"
                  >更新</el-button
                >
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  confirm-button-type="danger"
                  title="确定删除吗？"
                  @confirm.stop="delSearch(scope.row, scope.$index)"
                >
                  <template #reference>
                    <el-button
                      type="danger"
                      v-loading="searchListDelLoading === scope.$index"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
              <div class="add" v-else>
                <el-button
                  type="primary"
                  v-loading="searchListSaveLoading === scope.$index"
                  @click="saveSearch(scope.row, scope.$index)"
                  >保存</el-button
                >
                <el-button type="danger" @click="cancelAddSearch()"
                  >取消</el-button
                >
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DataSourceConf ref="DataSourceConfRef" />
  </div>
</template>
<script lang="ts" setup>
import DataSourceConf from "@/views/dev/components/DataSourceConf.vue";
import {
  SystemDevControllerCreateModuleSearch,
  SystemDevControllerDeleteModuleSearch,
  SystemDevControllerDevUpdateModuleSearch,
  SystemDevControllerGetModuleSearchList,
} from "@/api/SystemDevControllerApi";
import { ModuleConfDto } from "@/api/dto/ModuleConfDto";
import type { ModuleFieldDto } from "@/api/dto/ModuleFieldDto";
import { ModuleSearchDto } from "@/api/dto/ModuleSearchDto";
import { alertSuccess, alertWarning } from "@/utils/message";
import { ref } from "vue";
import { domType, methodConf } from "../confData";

const props = defineProps({
  moduleForm: {
    type: ModuleConfDto,
    required: true,
  },
  moduleFieldList: {
    type: Array<ModuleFieldDto>,
    required: true,
  },
});
const DataSourceConfRef = ref();
const openDataSource = (item: ModuleSearchDto) => {
  DataSourceConfRef.value.open(item);
};
const moduleSearchList = ref(new Array<ModuleSearchDto>());
const addSearch = () => {
  const dto = new ModuleSearchDto();
  dto.isAuto = false;
  dto.moduleUUID = props.moduleForm.UUID;
  dto.method = "like";
  dto.dom = "Input";
  moduleSearchList.value.unshift(dto);
};
const cancelAddSearch = () => {
  moduleSearchList.value.shift();
};
const searchListLoading = ref(false);
const getList = async () => {
  searchListLoading.value = true;
  const {
    data: { status, data, message },
  } = await SystemDevControllerGetModuleSearchList(`${props.moduleForm.UUID}`, {
    keyWord: "",
  });
  searchListLoading.value = false;
  if (status === 1) {
    moduleSearchList.value = data;
  } else {
    alertWarning(message);
  }
};
const searchFieldChange = (value: string, item: ModuleSearchDto) => {
  const filed = props.moduleFieldList.filter((f) => f.UUID == value)[0];
  item.dataChildField = filed.dataChildField;
  item.dataLabelField = filed.dataLabelField;
  item.dataValueField = filed.dataValueField;
  item.dom = filed.dom;
  item.domDataUrl = filed.domDataUrl;
  item.fieldEnName = filed.nameEn;
  item.fieldName = filed.name;
  item.fieldUUID = filed.UUID;
  item.fieldType = filed.type;
};
const searchListSaveLoading = ref(-1);
const saveSearch = async (item: ModuleSearchDto, index: number) => {
  item.moduleUUID = props.moduleForm.UUID;
  searchListSaveLoading.value = index;
  const filed = props.moduleFieldList.filter(
    (f) => f.UUID == item.fieldUUID
  )[0];
  item.dataChildField = filed.dataChildField;
  item.dataLabelField = filed.dataLabelField;
  item.dataValueField = filed.dataValueField;
  item.dom = filed.dom;
  item.domDataUrl = filed.domDataUrl;
  item.fieldEnName = filed.nameEn;
  item.fieldName = filed.name;
  item.fieldUUID = filed.UUID;
  item.fieldType = filed.type;
  const {
    data: { status, message },
  } = item._id
    ? await SystemDevControllerDevUpdateModuleSearch(item._id, item)
    : await SystemDevControllerCreateModuleSearch(item);
  if (status === 1) {
    alertSuccess("成功");
    getList();
  } else {
    alertWarning(message);
  }
  searchListSaveLoading.value = -1;
};
const searchListDelLoading = ref(-1);
const delSearch = async (item: ModuleSearchDto, index: number) => {
  if (!item._id) {
    throw new Error("id不能为空");
  }
  searchListDelLoading.value = index;
  const {
    data: { status, message },
  } = await SystemDevControllerDeleteModuleSearch(item._id);
  if (status === 1) {
    alertSuccess("删除成功");
    getList();
  } else {
    alertWarning(message);
  }
  searchListDelLoading.value = -1;
};
defineExpose({ getList });
</script>
