<template>
  <el-dialog
    v-model="show"
    :title="title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="70%"
    @closed="close()"
  >
    <div>
      <div class="detail">
        <div class="item">
          总收入：￥ {{ (Number(form.totalIncome) / 100).toFixed(2) }}
        </div>
        <div class="item">
          总支出：￥ {{ (Number(form.totalExpenditure) / 100).toFixed(2) }}
        </div>
        <div class="item">
          余额：￥ {{ (Number(form.balance) / 100).toFixed(2) }}
        </div>
      </div>
      <div class="operation">
        <el-button
          type="primary"
          @click="changesInFunds('1')"
          v-if="!form.freeze"
        >
          充值
        </el-button>
        <el-button
          type="primary"
          @click="changesInFunds('-1')"
          v-if="!form.freeze"
        >
          扣费
        </el-button>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          confirm-button-type="danger"
          :title="`确定${form.freeze ? '解冻' : '冻结'}？`"
          @confirm="freezeThaw()"
        >
          <template #reference>
            <el-button v-loading="freezeThawLoading" type="primary">
              {{ form.freeze ? "解冻" : "冻结" }}
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <el-divider />
    <h2 style="text-align: center; margin-top: 18px">流水明细</h2>
    <WalletLog ref="walletLogRef" v-if="form.UUID" :walletUUID="form.UUID" />
    <el-dialog
      v-model="walletShow"
      :title="changeInAmount.logType == '1' ? '充值' : '扣费'"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
      @closed="changeInAmountClose(changeInAmountFormRef)"
    >
      <el-form
        :model="changeInAmount"
        label-width="88px"
        :rules="rules"
        ref="changeInAmountFormRef"
      >
        <el-form-item label="金额" prop="amount">
          <el-input
            v-model="changeInAmount.amount"
            placeholder="输入金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            v-model="changeInAmount.remarks"
            placeholder="输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-loading="saveLoading"
            type="primary"
            @click="save(changeInAmountFormRef)"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { alertSuccess, alertWarning } from "@/utils/message";
import {
  WalletManagementControllerChangeInAmount,
  WalletManagementControllerFreezeThaw,
  WalletManagementControllerGetDetailByBindUserUUID,
} from "@/api/WalletManagementControllerApi";
import type { FormInstance, FormRules } from "element-plus";
import { WalletManagementDto } from "@/api/dto/WalletManagementDto";
import WalletLog from "@/views/walletLog/Index.vue";
import { WalletLogDto } from "@/api/dto/WalletLogDto";
const walletLogRef = ref();
const emit = defineEmits(["Refresh"]);
const show = ref(false);
const title = ref("钱包管理");
const form = ref(new WalletManagementDto());
const changeInAmount = ref(new WalletLogDto());
const changeInAmountFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  amount: [
    { required: true, message: "金额不能为空", trigger: "blur" },
    {
      pattern: /^(\d+|\d+\.\d{1,2})$/,
      message: "请输入数字,且最多保留2位小数",
      trigger: "blur",
    },
  ],
  remarks: [{ required: true, message: "备注不能为空", trigger: "blur" }],
});
const open = (bindUserUUID: string) => {
  show.value = true;
  getDetail(bindUserUUID);
};
const init = () => {
  getDetail(form.value.bindUserUUID);
  walletLogRef.value.getPage();
};

const freezeThawLoading = ref(false);
const freezeThaw = async () => {
  console.log("冻结解冻", form.value.UUID);
  freezeThawLoading.value = true;
  const {
    data: { status, message },
  } = await WalletManagementControllerFreezeThaw(form.value.bindUserUUID);
  freezeThawLoading.value = false;
  if (status === 1) {
    alertSuccess(message);
    init();
  } else {
    alertWarning(message);
  }
};
const walletShow = ref(false);
const changesInFunds = (type: string) => {
  changeInAmount.value.logType = type;
  walletShow.value = true;
};
const saveLoading = ref(false);
const save = async (formEl: FormInstance | undefined) => {
  console.log("保存资金变动");
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      saveLoading.value = true;
      const {
        data: { status, message },
      } = await WalletManagementControllerChangeInAmount(
        form.value.bindUserUUID,
        changeInAmount.value
      );
      saveLoading.value = false;
      if (status === 1) {
        alertSuccess(message);
        walletShow.value = false;
        init();
      } else {
        alertWarning(message);
      }
    } else {
      alertWarning("表单校验未通过，请根据提示重新填写");
    }
  });
};

const getDetail = async (bindUserUUID: string) => {
  const {
    data: { status, data, message },
  } = await WalletManagementControllerGetDetailByBindUserUUID(bindUserUUID);
  if (status === 1) {
    form.value = data;
    title.value = `${data.remarks.split("】")[0]}】的钱包`;
  } else {
    alertWarning(message);
  }
};
const changeInAmountClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  walletShow.value = false;
  changeInAmount.value = new WalletLogDto();
};
const close = () => {
  show.value = false;
  form.value = new WalletManagementDto();
  emit("Refresh");
};

defineExpose({ open });
</script>
<style lang="scss" scoped>
.detail {
  display: flex;
  font-size: 20px;
  font-weight: 700;
  .item {
    margin: 0 18px;
  }
}
.operation {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
}
</style>
