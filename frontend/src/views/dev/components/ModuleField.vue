<template>
  <div>
    <div style="margin-top: 20px">
      <h3 style="margin-bottom: 20px">字段配置</h3>
      <el-button type="primary" @click="addField()">新增</el-button>
      <el-table
        v-loading="fieldListLoading"
        :data="moduleFieldList"
        style="width: 100%"
      >
        <el-table-column label="中文名" prop="name" width="188px">
          <template #default="scope">
            <el-input
              v-model="scope.row.name"
              @blur="translateZhToEn(scope.row)"
              placeholder="中文名称"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="英文名称" prop="nameEn" width="188px">
          <template #default="scope">
            <el-input
              v-model="scope.row.nameEn"
              placeholder="英文名称"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type">
          <template #default="scope">
            <el-select v-model="scope.row.type" placeholder="请选择数据类型">
              <el-option
                v-for="item in dataType"
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
        <el-table-column label="是否唯一" prop="notRepeat">
          <template #default="scope">
            <el-switch v-model="scope.row.notRepeat" />
          </template>
        </el-table-column>
        <el-table-column label="必填" prop="notRepeat">
          <template #default="scope">
            <el-switch v-model="scope.row.notNull" />
          </template>
        </el-table-column>
        <el-table-column label="列表显示" prop="listShow">
          <template #default="scope">
            <el-switch v-model="scope.row.listShow" />
          </template>
        </el-table-column>
        <el-table-column label="默认值" prop="defaultValue">
          <template #default="scope">
            <el-input
              v-model="scope.row.defaultValue"
              placeholder="默认值"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="80px">
          <template #default="scope">
            <el-input v-model="scope.row.sort" placeholder="排序"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template #default="scope">
            <div>
              <div class="edit" v-if="scope.row.UUID">
                <el-button
                  type="primary"
                  v-loading="fieldListSaveLoading === scope.$index"
                  @click="saveField(scope.row, scope.$index)"
                  >更新</el-button
                >
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  confirm-button-type="danger"
                  title="确定删除吗？"
                  @confirm.stop="delField(scope.row, scope.$index)"
                >
                  <template #reference>
                    <el-button
                      type="danger"
                      v-loading="fieldListDelLoading === scope.$index"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
              <div class="add" v-else>
                <el-button
                  type="primary"
                  v-loading="fieldListSaveLoading === scope.$index"
                  @click="saveField(scope.row, scope.$index)"
                  >保存</el-button
                >
                <el-button type="danger" @click="cancelAddField()"
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
  SystemDevControllerCreateModuleField,
  SystemDevControllerDeleteModuleField,
  SystemDevControllerDevUpdateModuleField,
  SystemDevControllerGetModuleFieldList,
  SystemDevControllerTranslateZhToEn,
} from "@/api/SystemDevControllerApi";
import { ModuleConfDto } from "@/api/dto/ModuleConfDto";
import { ModuleFieldDto } from "@/api/dto/ModuleFieldDto";
import { ref } from "vue";
import { dataType, domType } from "../confData";
import { alertSuccess, alertWarning } from "@/utils/message";
import { initialLocaleUpper, initialLowercase } from "@/utils/tools";

const emit = defineEmits(["listChange"]);
const props = defineProps({
  moduleForm: {
    type: ModuleConfDto,
    required: true,
  },
});
const DataSourceConfRef = ref();
const openDataSource = (item: ModuleFieldDto) => {
  DataSourceConfRef.value.open(item);
};
const moduleFieldList = ref(new Array<ModuleFieldDto>());
const addField = () => {
  const dto = new ModuleFieldDto();
  dto.listShow = false;
  dto.type = "string";
  dto.notRepeat = false;
  dto.dom = "Input";
  dto.notNull = false;
  moduleFieldList.value.unshift(dto);
};
const translateZhToEn = async (row: ModuleFieldDto) => {
  if (!row.name || row.nameEn) {
    return;
  }
  const {
    data: { status, data, message },
  } = await SystemDevControllerTranslateZhToEn({ keyWord: row.name });
  if (status === 1) {
    if (!row.nameEn) {
      row.nameEn = initialLowercase(
        data
          .split(" ")
          .map((item: string) => initialLocaleUpper(item))
          .join("")
      );
    }
  } else {
    alertWarning(message);
  }
};
const cancelAddField = () => {
  moduleFieldList.value.shift();
};
const fieldListLoading = ref(false);
const getList = async () => {
  fieldListLoading.value = true;
  const {
    data: { status, data, message },
  } = await SystemDevControllerGetModuleFieldList(`${props.moduleForm.UUID}`, {
    keyWord: "",
  });
  fieldListLoading.value = false;
  if (status === 1) {
    moduleFieldList.value = data;
    emit("listChange", moduleFieldList.value);
  } else {
    alertWarning(message);
  }
};
const fieldListSaveLoading = ref(-1);
const saveField = async (item: ModuleFieldDto, index: number) => {
  console.log(index);
  item.moduleUUID = props.moduleForm.UUID;
  fieldListSaveLoading.value = index;
  const {
    data: { status, message },
  } = item.UUID
    ? await SystemDevControllerDevUpdateModuleField(item.UUID, item)
    : await SystemDevControllerCreateModuleField(item);
  if (status === 1) {
    alertSuccess("成功");
    getList();
  } else {
    alertWarning(message);
  }
  fieldListSaveLoading.value = -1;
};
const fieldListDelLoading = ref(-1);
const delField = async (item: ModuleFieldDto, index: number) => {
  if (!item._id) {
    throw new Error("id不能为空");
  }
  fieldListDelLoading.value = index;
  const {
    data: { status, message },
  } = await SystemDevControllerDeleteModuleField(item._id);
  if (status === 1) {
    alertSuccess("删除成功");
    getList();
  } else {
    alertWarning(message);
  }
  fieldListDelLoading.value = -1;
};
defineExpose({ getList });
</script>
