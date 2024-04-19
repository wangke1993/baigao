<template>
  <el-dialog
    v-model="show"
    :title="title"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="70%"
    @closed="close(walletLogFormRef)"
  >
    <el-form
      :model="form"
      label-width="120px"
      :rules="rules"
      ref="walletLogFormRef"
    >
      <el-form-item label="所属钱包:" prop="walletUUID">
        <el-input
          v-model="form.walletUUID"
          placeholder="所属钱包"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="金额（分）:" prop="amount">
        <el-input-number
          v-model="form.amount"
          placeholder="金额（分）"
          clearable
        ></el-input-number>
      </el-form-item>
      <el-form-item label="余额:" prop="balance">
        <el-input
          v-model="form.balance"
          placeholder="余额"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="类型:" prop="logType">
        <el-select
          style="width: 100%"
          v-model="form.logType"
          clearable
          placeholder="请选择类型"
          @change="logTypeSelectChange"
        >
          <el-option
            v-for="item in logTypeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
          v-if="btnShow('save-walletLog')"
          type="primary"
          @click="save(walletLogFormRef)"
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
import { AdministrativeDivisionsControllerGetListByDicClass } from "@/api/AdministrativeDivisionsControllerApi";
import { SelectDto } from "@/common/CommonDto";
import {
  WalletLogControllerCreate,
  WalletLogControllerGetDetailById,
  WalletLogControllerUpdate,
} from "@/api/WalletLogControllerApi";
import type { FormInstance, CascaderProps, FormRules } from "element-plus";
import { ExpandTrigger } from "element-plus";
import { WalletLogDto } from "@/api/dto/WalletLogDto";
const emit = defineEmits(["Refresh"]);
const show = ref(false);
const title = ref("添加钱包流水");
const form = ref(new WalletLogDto());
const walletLogFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  walletUUID: [
    { required: true, message: "所属钱包不能为空", trigger: "blur" },
  ],
  amount: [{ required: true, message: "金额（分）不能为空", trigger: "blur" }],
  balance: [{ required: true, message: "余额不能为空", trigger: "blur" }],
  logType: [{ required: true, message: "类型不能为空", trigger: "blur" }],
  remarks: [],
});
const open = (item: WalletLogDto) => {
  show.value = true;
  if (item?._id) {
    title.value = "编辑钱包流水";
    getDetail(item._id);
  } else {
    title.value = "添加钱包流水";
  }
};

// 获取select数据
const logTypeSelect = ref(new Array<SelectDto<any>>());
const getLogTypeSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/admin/dic/getList/DC0013");
  if (status === 1) {
    data.map((item: any) => {
      logTypeSelect.value.push(
        new SelectDto<any>(item["dicName"], item["value"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getLogTypeSelect();
const logTypeSelectChange = (value: string) => {
  form.value.logTypeText = logTypeSelect.value.filter(
    (item) => item.value == value
  )[0].label;
};
const getDetail = async (id: string) => {
  const {
    data: { status, data, message },
  } = await WalletLogControllerGetDetailById(id);
  if (status === 1) {
    form.value = data;
    initOtherValue(data);
  } else {
    alertWarning(message);
  }
};
const initOtherValue = (data: WalletLogDto) => {
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
        ? await WalletLogControllerUpdate(form.value._id, form.value)
        : await WalletLogControllerCreate(form.value);
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
  form.value = new WalletLogDto();
  initOtherValue(form.value);
};

defineExpose({ open });
</script>
