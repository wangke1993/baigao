<template>
  <el-dialog :title="title" v-model="visible" @close="close">
    <el-form :model="form" label-width="188px">
      <el-form-item label="绑定字典">
        <el-cascader
          v-if="visible"
          v-model="form.confSelect"
          :options="dicTree"
          :props="dicTreeProps"
          @change="dicTreeChange"
          style="width: 100%"
          ref="dicTreeRef"
        />
      </el-form-item>
      <el-form-item label="允许查看">
        <el-switch v-model="form.allowFetch"></el-switch>
      </el-form-item>
      <el-form-item label="无token获取">
        <el-switch v-model="form.isOpen"></el-switch>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.labelName" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="说明">
        <el-input v-model="form.description" placeholder="说明"></el-input>
      </el-form-item>
      <el-form-item label="绑定Dom">
        <el-select
          v-model="form.dom"
          placeholder="绑定Dom"
          @change="domChange"
          style="width: 100%"
        >
          <el-option
            v-for="item in domSelect"
            :key="item.value"
            :value="item.value"
            :label="`${item.label}${item.developing ? '-(开发中)' : ''}`"
            :disabled="item.developing"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="needUrl" label="绑定dom获取数据URL">
        <el-input
          v-model="form.dataUrl"
          placeholder="绑定dom获取配置URL"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="needUrl" label="选项标签字段">
        <el-input
          v-model="form.dataLabel"
          placeholder="选项标签字段"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="needUrl" label="选项值字段">
        <el-input v-model="form.dataValue" placeholder="选项值字段"></el-input>
      </el-form-item>
      <el-form-item label="默认值">
        <el-input v-model="form.defaultValue" placeholder="默认值"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="form.sortAsc"
          placeholder="排序"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ConfigGroup, ConfigGroupItem } from "../SystemConfigPage";
import { DataDictionaryControllerGetTree } from "@/api/DataDictionaryControllerApi";
import { SystemConfigDto } from "@/api/dto/SystemConfigDto";
import {
  SystemConfigControllerCreate,
  SystemConfigControllerUpdate,
} from "@/api/SystemConfigControllerApi";
import { alertSuccess, alertWarning } from "@/utils/message";

/**
 * 保存编辑页面配置
 */
const form = ref(new ConfigGroupItem());
const visible = ref(false);
const title = ref("新增配置项");
const isEdit = ref(true);
const dicTree = ref([]);
const dicTreeProps = {
  emitPath: false,
  value: "dicCode",
  label: "dicName",
};
let ConfigGroupItemList: ConfigGroupItem[] = [];
const domSelect = ref([
  { value: "Input", label: "单行文本", developing: false, needUrl: false },
  { value: "Password", label: "密码", developing: false, needUrl: false },
  { value: "Area", label: "多行文本", developing: false, needUrl: false },
  { value: "Swatch", label: "开关", developing: false, needUrl: false },
  { value: "Select", label: "单选下拉", developing: false, needUrl: true },
  { value: "MoreSelect", label: "多选下拉", developing: false, needUrl: true },
  { value: "File", label: "附件", developing: false, needUrl: false },
  { value: "Image", label: "图片", developing: true, needUrl: false },
  { value: "MoreText", label: "富文本", developing: true, needUrl: false },
]);
const getDicTree = async () => {
  const {
    data: { status, data },
  } = await DataDictionaryControllerGetTree();
  if (status == 1) {
    dicTree.value = data;
  }
};
const needUrl = ref(false);
const domChange = (v: any) => {
  needUrl.value = domSelect.value.filter((item) => item.value == v)[0].needUrl;
};
const dicTreeRef = ref();
const dicTreeChange = () => {
  const dic = dicTreeRef.value.getCheckedNodes()[0]?.data;
  if (dic) {
    form.value.confType = dic.dicClass;
    form.value.description = dic.remarks;
    form.value.labelName = dic.dicName;
  }
};
const open = async (
  configGroupItemList: ConfigGroupItem[],
  configItem: ConfigGroupItem
) => {
  await getDicTree();
  visible.value = true;
  ConfigGroupItemList = configGroupItemList;
  if (configItem) {
    form.value = configItem;
    title.value = "编辑配置项";
    isEdit.value = true;
  } else {
    title.value = "新增配置项";
    form.value.sortAsc = 0;
    isEdit.value = false;
    form.value.allowFetch = true;
    form.value.dom = "Input";
  }
};
const close = () => {
  form.value = new ConfigGroupItem();
  ConfigGroupItemList = [];
};
const save = async () => {
  const body = new SystemConfigDto();
  body.allowFetch = form.value.allowFetch;
  body.confSelect = form.value.confSelect;
  body.isOpen = form.value.isOpen;
  body.remarks = form.value.description;
  if (!isEdit.value) {
    body.isSet = false;
    body.confValue = form.value.defaultValue;
    const {
      data: { status, message },
    } = await SystemConfigControllerCreate(body);
    if (status == 1) {
      alertSuccess("保存成功");
      ConfigGroupItemList.push({ ...form.value });
    } else {
      alertWarning(message);
      return;
    }
  } else {
    if (body.confSelect) {
      const {
        data: { status, message },
      } = await SystemConfigControllerUpdate(body.confSelect, body);
      if (status == 1) {
        alertSuccess("更新成功");
      } else {
        alertWarning(message);
        return;
      }
    } else {
      return;
    }
  }
  ConfigGroupItemList.sort((a, b) => a.sortAsc - b.sortAsc);
  visible.value = false;
};
defineExpose({ open });
</script>
<style lang="scss">
.add-btn {
  margin-left: 10px;
}
</style>
