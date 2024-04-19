<template>
  <el-dialog
    v-model="show"
    :title="title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="70%"
    @closed="close(walletManagementFormRef)"
  >
    <el-form
      :model="form"
      label-width="120px"
      :rules="rules"
      ref="walletManagementFormRef"
    >
      <el-form-item label="所属用户:" prop="bindUserUUID">
        <el-input
          v-model="form.bindUserUUID"
          placeholder="所属用户"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="余额（分）:" prop="balance">
        <el-input-number
          v-model="form.balance"
          placeholder="余额（分）"
          clearable
        ></el-input-number>
      </el-form-item>
      <el-form-item label="总收入（分）:" prop="totalIncome">
        <el-input-number
          v-model="form.totalIncome"
          placeholder="总收入（分）"
          clearable
        ></el-input-number>
      </el-form-item>
      <el-form-item label="总支出（分）:" prop="totalExpenditure">
        <el-input-number
          v-model="form.totalExpenditure"
          placeholder="总支出（分）"
          clearable
        ></el-input-number>
      </el-form-item>
      <el-form-item label="备注:" prop="remarks">
        <el-input
          type="textarea"
          clearable
          :rows="2"
          placeholder="请输入备注"
          v-model="form.remarks"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-loading="saveLoading"
          v-if="btnShow('save-walletManagement')"
          type="primary"
          @click="save(walletManagementFormRef)"
        >
          {{ form._id ? "更新" : "保存" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { btnShow } from "@/utils/buttonShow";
import { getToken } from "@/utils/authTokenUtil";
import { viewIcon } from "@/utils/enum/iconBase64";
import { alertSuccess, alertWarning } from "@/utils/message";
import {
  WalletManagementControllerCreate,
  WalletManagementControllerGetDetailById,
  WalletManagementControllerUpdate,
} from "@/api/WalletManagementControllerApi";
import type { FormInstance, CascaderProps, FormRules } from "element-plus";
import { ExpandTrigger } from "element-plus";
import { WalletManagementDto } from "@/api/dto/WalletManagementDto";
const emit = defineEmits(["Refresh"]);
const show = ref(false);
const title = ref("添加钱包管理");
const form = ref(new WalletManagementDto());
const walletManagementFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  bindUserUUID: [
    { required: true, message: "所属用户不能为空", trigger: "blur" },
  ],
  balance: [],
  totalIncome: [],
  totalExpenditure: [],
  remarks: [],
});
const open = (item: WalletManagementDto) => {
  show.value = true;
  if (item?._id) {
    title.value = "编辑钱包管理";
    getDetail(item._id);
  } else {
    title.value = "添加钱包管理";
    form.value.balance = 0;

    form.value.totalIncome = 0;

    form.value.totalExpenditure = 0;
  }
};

const getDetail = async (id: string) => {
  const {
    data: { status, data, message },
  } = await WalletManagementControllerGetDetailById(id);
  if (status === 1) {
    form.value = data;
    initOtherValue(data);
  } else {
    alertWarning(message);
  }
};
const initOtherValue = (data: WalletManagementDto) => {
  console.log(data);
};
const saveLoading = ref(false);
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      saveLoading.value = true;
      const {
        data: { status, message },
      } = form.value._id
        ? await WalletManagementControllerUpdate(form.value._id, form.value)
        : await WalletManagementControllerCreate(form.value);
      saveLoading.value = false;
      if (status === 1) {
        alertSuccess("成功");
        if (!form.value?._id) {
          show.value = false;
        }
        emit("Refresh");
      } else {
        alertWarning(message);
      }
    } else {
      alertWarning("表单校验未通过，请根据提示重新填写");
    }
  });
};

const close = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  show.value = false;
  form.value = new WalletManagementDto();
  initOtherValue(form.value);
};

defineExpose({ open });
</script>
