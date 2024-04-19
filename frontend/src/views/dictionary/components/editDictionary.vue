<template>
  <el-dialog
    v-model="state.dialogFormVisible"
    :title="title"
    @closed="closeForm(ruleFormRef)"
  >
    <el-form :model="form" :rules="rules" :inline="true" ref="ruleFormRef">
      <el-form-item label="字典值" prop="dicName">
        <el-input v-model="form.dicName" />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="form.value" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="form.remarks" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="state.userListData" row-key="_id">
      <el-table-column type="index" width="60" align="center" label="序号" />
      <el-table-column prop="dicCode" label="编码" />
      <el-table-column label="字典名称">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-input
              :disabled="scope.row.disabled ? false : true"
              v-model="scope.row.dicName"
            />
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="值">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-input
              :disabled="scope.row.disabled ? false : true"
              v-model="scope.row.value"
            />
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-input
              :disabled="scope.row.disabled ? false : true"
              v-model="scope.row.remarks"
            />
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310">
        <template #default="scope">
          <el-button-group class="ml-4">
            <el-button
              v-if="scope.row.disabled"
              type="primary"
              :icon="Edit"
              @click="addDictionaryFun(scope.$index, scope.row, 'submit')"
              >保存
            </el-button>
            <el-button
              v-if="scope.row.disabled"
              type="primary"
              :icon="Close"
              @click="addDictionaryFun(scope.$index, scope.row, 'cancel')"
              >取消
            </el-button>
            <el-button
              v-else
              type="primary"
              :icon="Edit"
              @click="addDictionaryFun(scope.$index, scope.row, 'edit')"
              >编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              confirm-button-type="danger"
              title="确定删除该字典？"
              @confirm="deleteDictionary(scope.row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  v-if="!scope.row.isSystem"
                  :icon="Delete"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script lang="ts" setup>
/**
 * 新增值、值类型及相关配置
 */
import { ref, reactive } from "vue";
import {
  DataDictionaryControllerCreate,
  DataDictionaryControllerGetListByDicClass,
  DataDictionaryControllerUpdate,
  DataDictionaryControllerDelete,
} from "../../../api/DataDictionaryControllerApi";
import type { FormInstance, FormRules, TabsPaneContext } from "element-plus";
import { Delete, Edit, Plus, Close } from "@element-plus/icons-vue";
import { alertSuccess } from "@/utils/message";
const ruleFormRef = ref<FormInstance>();
const form = ref({
  dicName: "",
  dicType: 2,
  remarks: "",
  dicClass: "",
  value: "",
});
const title = ref("字典值管理");
const state = reactive({
  dialogFormVisible: false,
  userListData: [],
});
// 校验
const rules = reactive<FormRules>({
  dicName: [{ required: true, message: "字典值不能为空", trigger: "blur" }],
});

// 打开弹窗
const open = (item: any) => {
  if (item.dicCode) {
    form.value.dicClass = item.dicCode;
    title.value = item.dicName;
    getDataDictionaryControllerGetListByDicClass(item.dicCode);
  }
  state.dialogFormVisible = true;
};
const emit = defineEmits(["refreshList"]);
// 关闭弹窗
const closeForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  state.dialogFormVisible = false;
  form.value = {
    dicName: "",
    dicType: 2,
    remarks: "",
    dicClass: "",
    value: "",
  };
  emit("refreshList");
};

// 根据字典分类(分类dicCode)获取字典值
const getDataDictionaryControllerGetListByDicClass = async (
  dicCode: string
) => {
  try {
    let result = await DataDictionaryControllerGetListByDicClass(dicCode);
    let data = result.data;
    if (data.status === 1) {
      state.userListData = data.data;
    }
  } catch (err) {
    return;
  }
};

//提交按钮
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      postDataDictionaryControllerCreate(form.value);
    }
  });
};

// 新增字典值
const postDataDictionaryControllerCreate = async (params: any) => {
  try {
    let result = await DataDictionaryControllerCreate(params);
    let data = result.data;
    if (data.status === 1) {
      alertSuccess("操作成功");
      form.value.dicName = "";
      form.value.value = "";
      form.value.remarks = "";
      getDataDictionaryControllerGetListByDicClass(form.value.dicClass);
    }
  } catch (err) {
    return;
  }
};

// 编辑 保存 取消按钮
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addDictionaryFun = (index: number, items: any, type: string) => {
  if (type == "edit") items.disabled = true;
  else if (type == "submit") {
    const { dicName, dicType, remarks, _id, value } = items;
    let params = { dicName, dicType, remarks, value };
    postDataDictionaryControllerUpdate(_id, params, items);
  } else {
    items.disabled = false;
  }
};

// 编辑
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postDataDictionaryControllerUpdate = async (
  id: any,
  params: any,
  items: any
) => {
  try {
    let result = await DataDictionaryControllerUpdate(id, params);
    let data = result.data;
    if (data.status === 1) {
      alertSuccess("操作成功");
      items.disabled = false;
    }
  } catch (err) {
    return;
  }
};

// 删除字典分类
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteDictionary = async (params: any) => {
  try {
    let result = await DataDictionaryControllerDelete(params.dicCode);
    let data = result.data;
    if (data.status === 1) {
      alertSuccess("操作成功");
      getDataDictionaryControllerGetListByDicClass(form.value.dicClass);
    }
  } catch (err) {
    return;
  }
};

defineExpose({ open });
</script>

<style lang="scss" scoped>
.el-dialog__body {
  padding: 0 20px;
}

.el-table {
  min-height: 300px;
}
</style>
