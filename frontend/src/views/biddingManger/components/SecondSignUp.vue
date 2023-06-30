<template>
  <el-dialog v-model="state.dialogVisible" :title="state.title" :close-on-press-escape="false"
    :close-on-click-modal="false" width="70%" @closed="closeForm(ruleFormRef)">
    <el-form :model="state.form" label-width="180px" :rules="rules" ref="ruleFormRef">
      <el-form-item label="报名截止日期" prop="secondTime">
        <el-date-picker v-model="state.form.secondTime" placeholder="请选择报名截止日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="进入二轮供应商" prop="secondSupplier">
        <el-select v-model="state.form.secondSupplier" multiple class="m-2" placeholder="请选择进入二轮的供应商" size="large"
          style="width: 100%">
          <el-option v-for="(item, index) in state.supplierArr" :key="index" :label="item.supplierName"
            :value="item.supplierUUID" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit(ruleFormRef)">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { BiddingMangerControllerStartSecond } from '@/api/BiddingMangerControllerApi';
import { BiddingMangerControllerGetBiddingDetailById, BiddingMangerControllerGetBiddingDetailByUUID, BiddingMangerControllerGetBiddingSignUpList } from '@/api/BiddingMangerControllerApi';
import type { StartSecondDtoDto } from '@/api/dto/StartSecondDtoDto';
import { alertSuccess, alertWarning } from '@/utils/message';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';
const ruleFormRef = ref();
const state = ref({
  dialogVisible: false,
  title: '开启第二轮',
  form: {} as StartSecondDtoDto,
  supplierArr: [] as Array<any>,
})
const rules = {
  secondTime: [{ required: true, message: '请选择截止日期', trigger: 'blur' }],
  secondSupplier: [{ required: true, message: '请选择供应商', trigger: 'change' }]
}
const open = (biddingUUID: string, progressID: string) => {
  state.value.dialogVisible = true;
  state.value.form.biddingUUID = biddingUUID;
  state.value.form.progressID = progressID;
  // 获取下拉框
  getSupplierList(biddingUUID);
  // 获取详情
  getDetail(biddingUUID);
}
const getSupplierList = async (biddingUUID: string) => {
  const { data: { status, data, message } } = await BiddingMangerControllerGetBiddingSignUpList(biddingUUID);
  if (status == 1) {
    state.value.supplierArr = data;
  } else {
    alertWarning(message);
  }
}
const getDetail = async (biddingUUID: string) => {
  const { data: { status, data: { secondTime, secondSupplier }, message } } = await BiddingMangerControllerGetBiddingDetailByUUID(biddingUUID);
  if (status == 1) {
    state.value.form.secondSupplier = secondSupplier;
    state.value.form.secondTime = secondTime;
  } else {
    console.log(message);
  }
}
const emit = defineEmits(['getProgressDetail']);
const submit = async (formEl: FormInstance | undefined) => {
  // 提交
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { data: { status, message } } = await BiddingMangerControllerStartSecond(state.value.form);
      if (status == 1) {
        alertSuccess(message);
        emit('getProgressDetail', state.value.form.biddingUUID);
        state.value.dialogVisible = false;
      } else {
        alertWarning(message);
      }
    } else {
      console.log("校验失败", fields);
    }
  });
}
const closeForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  state.value = {
    dialogVisible: false,
    title: '开启第二轮',
    form: {} as StartSecondDtoDto,
    supplierArr: [] as Array<any>,
  };
}
defineExpose({ open });
</script>