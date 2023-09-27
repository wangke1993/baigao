<template>
  <el-form
    :inline="true"
    :model="searchForm"
    ref="searchFormRef"
    class="demo-form-inline"
  >
    <el-form-item label="">
      <el-input v-model="searchForm.keyWord" :placeholder="props.placeholder" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">搜索</el-button>
      <el-button @click="onResetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
//依赖
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref, defineProps, defineEmits } from "vue";
const searchFormRef = ref<FormInstance>();
const searchForm = ref({
  keyWord: "",
});

const emit = defineEmits(["handleSearch"]);
const props = defineProps(["placeholder"]);
console.log(props);
const onSubmit = () => {
  emit("handleSearch", searchForm.value);
};

const onResetForm = () => {
  searchForm.value = {
    keyWord: "",
  };
  emit("handleSearch", searchForm.value);
};
</script>
