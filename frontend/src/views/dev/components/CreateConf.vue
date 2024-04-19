<template>
  <el-dialog v-model="openState" @close="close" :title="title">
    <el-form :model="form" :label-width="100">
      <el-form-item label="生成范围">
        <el-checkbox v-model="form.backend" label="后端" size="large" />
        <el-checkbox v-model="form.frontend" label="前端" size="large" />
      </el-form-item>
      <el-form-item label="输出路径">
        <el-checkbox v-model="form.isTemp" label="临时路径" size="large" />
      </el-form-item>
      <el-form-item label="后端配置" v-if="form.backend">
        <el-checkbox v-model="form.config.UUID" label="使用UUID" size="large" />
        <el-checkbox v-model="form.config.add" label="增" size="large" />
        <el-checkbox v-model="form.config.del" label="删" size="large" />
        <el-checkbox v-model="form.config.update" label="改" size="large" />
        <el-checkbox v-model="form.config.query" label="查" size="large" />
      </el-form-item>
      <el-form-item label="后端文件" v-if="form.backend">
        <el-checkbox v-model="form.backendFile.dto" label="Dto" size="large" />
        <el-checkbox
          v-model="form.backendFile.pageDto"
          label="pageDto"
          size="large"
        />
        <el-checkbox
          v-model="form.backendFile.controller"
          label="controller"
          size="large"
        />
        <el-checkbox
          v-model="form.backendFile.service"
          label="service"
          size="large"
        />
        <el-checkbox
          v-model="form.backendFile.module"
          label="module"
          size="large"
        />
      </el-form-item>
      <el-form-item label="前端文件" v-if="form.frontend">
        <el-checkbox
          v-model="form.frontendFile.list"
          label="列表页"
          size="large"
        />
        <el-checkbox
          v-model="form.frontendFile.search"
          label="搜索组件"
          size="large"
        />
        <el-checkbox
          v-model="form.frontendFile.form"
          label="表单页"
          size="large"
        />
        <el-checkbox
          v-model="form.frontendFile.dto"
          label="数据模型"
          size="large"
        />
        <el-checkbox
          v-model="form.frontendFile.api"
          label="接口文件"
          size="large"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save()">生成</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { CreateCodeConfDto } from "./create-code-conf.dto";
import { ModuleConfDto } from "@/api/dto/ModuleConfDto";
import { SystemDevControllerCreateCode } from "@/api/SystemDevControllerApi";
import { alertSuccess, alertWarning } from "@/utils/message";
const openState = ref(false);
const title = ref("生成配置");
const form = ref(new CreateCodeConfDto());
const emit = defineEmits(['getModelList'])
const props = defineProps({
  moduleForm: {
    type: ModuleConfDto,
    required: true,
  },
});
const open = () => {
  form.value = new CreateCodeConfDto();
  openState.value = true;
};
const close = () => {
  openState.value = false;
};
const createCodeLoading = ref(false);
const save = async () => {
  if (!props.moduleForm.UUID) {
    throw new Error("UUID不能为空");
  }
  createCodeLoading.value = true;
  const {
    data: { status, message },
  } = await SystemDevControllerCreateCode(props.moduleForm.UUID, form.value);
  createCodeLoading.value = false;
  if (status === 1) {
    alertSuccess("生成成功");
    emit('getModelList');
  } else {
    alertWarning(message);
  }
};
defineExpose({ open });
</script>
