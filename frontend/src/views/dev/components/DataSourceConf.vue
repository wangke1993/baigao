<template>
  <el-dialog v-model="openState" @close="close" :title="title">
    <el-form :model="fieldData" :label-width="100">
      <el-form-item label="数据源URL">
        <el-input v-model="fieldData.domDataUrl" placeholder="URL"></el-input>
      </el-form-item>
      <el-form-item label="值字段">
        <el-input
          v-model="fieldData.dataValueField"
          placeholder="值字段名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="标签字段">
        <el-input
          v-model="fieldData.dataLabelField"
          placeholder="标签字段名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="孩子字段" v-if="['TreeSelect','MoreTreeSelect'].includes(fieldData.dom?fieldData.dom:'Select')">
        <el-input
          v-model="fieldData.dataChildField"
          placeholder="孩子字段名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save()">确定</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, defineExpose, type Ref } from "vue";
import { ModuleFieldDto } from "@/api/dto/ModuleFieldDto";
import type { ModuleSearchDto } from "@/api/dto/ModuleSearchDto";
const openState = ref(false);
const title = ref("");
const fieldData:Ref<ModuleFieldDto | ModuleSearchDto>  = ref(new ModuleFieldDto());
const open = (item: ModuleFieldDto | ModuleSearchDto) => {
  openState.value = true;
  fieldData.value = item;
  if (!fieldData.value.dataChildField) {
    fieldData.value.dataChildField = 'children';
  }
};
const close = () => {
  openState.value = false;
};
const save = () => {
  openState.value = false;
};
defineExpose({ open });
</script>
