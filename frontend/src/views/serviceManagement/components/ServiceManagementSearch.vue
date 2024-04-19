<template>
  <el-form :inline="true" :model="searchForm" class="demo-form-inline">
    <el-form-item>
      <slot></slot>
    </el-form-item>
    <el-form-item label="模糊搜索：">
      <el-input
        v-model="searchForm.keyWord"
        placeholder="标题/服务说明"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSearch">搜索</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import axios from "axios";
import { alertSuccess, alertWarning } from "@/utils/message";

class SearchDto {
  keyWord?: string;
}
const searchForm = ref(new SearchDto());
const emit = defineEmits(["search"]);

const onSearch = () => {
  emit("search", searchForm.value);
};
const onReset = () => {
  searchForm.value = new SearchDto();
  emit("search", searchForm.value);
};

watch(
  () => searchForm.value.keyWord,
  () => {
    emit("search", searchForm.value);
  }
);
</script>
