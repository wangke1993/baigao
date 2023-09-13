<template>
  <el-form
    v-if="state.open"
    :model="form"
    label-width="120px"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入名称" />
    </el-form-item>
    <el-form-item label="备注" prop="remarks">
      <el-input
        type="textarea"
        v-model="form.remarks"
        placeholder="请输入备注"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        v-loading="state.loading"
        type="primary"
        @click="submitForm(ruleFormRef)"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  toRefs,
  defineComponent,
  onBeforeUnmount,
  shallowRef,
  onMounted,
} from "vue";
import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadUserFile,
} from "element-plus";

import { alertSuccess, alertWarning } from "@/utils/message";
import { TreeClassificationDto } from "@/api/dto/TreeClassificationDto";
import {
  TreeClassificationControllerCreate,
  TreeClassificationControllerUpdate,
} from "@/api/TreeClassificationControllerApi";
const emit = defineEmits(["getTree"]);
const form = ref(new TreeClassificationDto());
const id = ref("");
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
  remarks: [],
});

const state = ref({
  open: false,
  loading: false,
});

const open = (add: boolean, item: any, breathCount: number) => {
  state.value.open = true;
  id.value = "";
  if (add) {
    form.value = new TreeClassificationDto();
    console.log("添加", item);
    form.value.parent = item.UUID;
    form.value.sort = breathCount.toString();
    form.value.breathCount = breathCount.toString();
    form.value.dataClass = item.dataClass;
  } else {
    form.value = { ...item };
    id.value = item._id;
  }
};
const close = () => {
  state.value.open = false;
  state.value.loading = false;
};
// 保存
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      state.value.loading = true;
      if (id.value) {
        // 更新
        const { data: res } = await TreeClassificationControllerUpdate(
          id.value,
          form.value
        );
        if (res.status == 1) {
          alertSuccess("成功");
        } else {
          alertWarning(res.message);
        }
      } else {
        // 创建
        if (form.value.UUID == "0") {
          //创建一级节点
        }
        const { data: res } = await TreeClassificationControllerCreate(
          form.value
        );
        if (res.status == 1) {
          alertSuccess("成功");
        } else {
          alertWarning(res.message);
        }
      }
      emit("getTree");
      state.value.loading = false;
      state.value.open = false;
    }
  });
};

defineExpose({ open, close });
</script>
