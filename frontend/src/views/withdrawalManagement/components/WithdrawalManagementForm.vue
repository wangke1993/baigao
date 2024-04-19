<template>
  <el-dialog
    v-if="show"
    v-model="show"
    :title="title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="58%"
    @closed="close(withdrawalManagementFormRef)"
  >
    <el-form
      :model="form"
      label-width="120px"
      :rules="rules"
      ref="withdrawalManagementFormRef"
    >
      <el-form-item label="拒绝原因:" prop="reason">
        <el-input
          v-model="form.reason"
          placeholder="请输入拒绝原因"
          type="textarea"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-loading="saveLoading"
          type="primary"
          @click="save(withdrawalManagementFormRef)"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { alertSuccess, alertWarning } from "@/utils/message";
import { WithdrawalManagementControllerRefuse } from "@/api/WithdrawalManagementControllerApi";
import type { FormInstance, FormRules } from "element-plus";
import { WithdrawalRefuseDto } from "@/api/dto/WithdrawalRefuseDto";
const emit = defineEmits(["Refresh"]);
const show = ref(false);
const title = ref("拒绝提现");
const form = ref(new WithdrawalRefuseDto());
form.value.reason;
const withdrawalManagementFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  reason: [{ required: true, message: "拒绝原因不能为空", trigger: "blur" }],
});
const open = (item: any) => {
  show.value = true;
  form.value.id = item._id;
};
const saveLoading = ref(false);
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      saveLoading.value = true;
      const {
        data: { status, message },
      } = await WithdrawalManagementControllerRefuse(form.value);
      saveLoading.value = false;
      if (status === 1) {
        alertSuccess("已拒绝");
        emit("Refresh");
        close(formEl);
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
  form.value = new WithdrawalRefuseDto();
};

defineExpose({ open });
</script>
