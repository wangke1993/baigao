<template>
  <el-dialog v-model="state.dialogFormVisible" :title="state.title" :close-on-press-escape="false"
    :close-on-click-modal="false" width="70%" @closed="closeForm(ruleFormRef)">
    <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef"
      @submit.native.prevent="submitForm(ruleFormRef)">
      <el-form-item label="别名" prop="name">
        <el-input v-model="form.name" placeholder="请输入别名" />
      </el-form-item>
      <el-form-item label="账号" prop="accountNumber">
        <el-input v-model="form.accountNumber" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="账户名称" prop="accountName">
        <el-input v-model="form.accountName" placeholder="请输入账户名称" />
      </el-form-item>
      <el-form-item label="开户行" prop="bankOfDeposit">
        <el-input v-model="form.bankOfDeposit" placeholder="请输入开户行" />
      </el-form-item>
      <el-form-item label="默认账号" prop="isDefault">
        <el-switch v-model="form.isDefault" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, defineComponent, onBeforeUnmount, shallowRef, onMounted } from "vue";
import type { FormInstance, FormRules, UploadFile, UploadUserFile } from "element-plus";
import { CollectionAccountManagementDto } from "@/api/dto/CollectionAccountManagementDto";
import { CollectionAccountManagementControllerAdd, CollectionAccountManagementControllerGetDetail, CollectionAccountManagementControllerUpdate } from "@/api/CollectionAccountManagementControllerApi";
import { alertSuccess, alertWarning } from "@/utils/message";
const emit = defineEmits(["Refresh"]);
const _id = ref("");
const form = ref(new CollectionAccountManagementDto());
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  articleName: [
    { required: true, message: "文章标题不能为空", trigger: "blur" },
  ],
  cover: [],
  articleClass: [
    { required: true, message: "不能为空", trigger: "change" },
  ],
  syn: [],
  content: [],
  release: [],
});

const state = ref({
  dialogFormVisible: false,
  title: "添加银行账号",
  load: false,
  userListData: [],
  params: {
    pageIndex: 1,
    pageSize: 10,
    total: 10,
  },
  dictionaryData: new Array<any>(),
});


// 获取详情
const getDetail = async (id: string) => {
  try {
    let result = await CollectionAccountManagementControllerGetDetail(id);
    let data = result.data;
    if (data.status === 1) {
      delete data.data._id;
      form.value = data.data;
    }
  } catch (err) {
    return;
  }
};

const open = (item: any) => {
  if (item) {
    getDetail(item._id);
    _id.value = item._id;
    state.value.title = "修改银行卡账号"
  } else {
    _id.value = "";
    state.value.title = "添加银行卡账号"
  }
  state.value.dialogFormVisible = true;
};

// 编辑
const edit = async (id: String, params: any) => {
  try {
    let result = await CollectionAccountManagementControllerUpdate(id, params);
    let data = result.data;
    if (data.status === 1) {
      closeForm(ruleFormRef.value);
      emit("Refresh");
      alertSuccess("更新成功")
    } else {
      alertWarning(data.message)
    }
  } catch (err) {
    return;
  }
};

// 创建
const create = async (params: CollectionAccountManagementDto) => {
  try {
    let result = await CollectionAccountManagementControllerAdd(params);
    let data = result.data;
    if (data.status === 1) {
      closeForm(ruleFormRef.value);
      emit("Refresh");
      alertSuccess("保存成功")
    } else {
      alertWarning(data.message)
    }
  } catch (err) {
    return;
  }
};

// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (_id.value) {
        edit(_id.value, form.value);
      } else {
        create(form.value)
      };
    }
  });
};

// 右上角关闭
const closeForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  state.value.dialogFormVisible = false;
  form.value = new CollectionAccountManagementDto();
};
defineExpose({ open });
</script>