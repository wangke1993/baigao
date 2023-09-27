<template>
  <el-form
    :inline="true"
    :model="searchForm"
    ref="searchFormRef"
    class="demo-form-inline"
  >
    <el-form-item>
      <slot></slot>
    </el-form-item>
    <el-form-item label="文字检索：">
      <el-input v-model="searchForm.keyWord" :placeholder="props.placeholder" />
    </el-form-item>
    <el-form-item label="文章分类：">
      <el-select
        v-model="searchForm.articleClass"
        class="m-2"
        placeholder="请选择文章分类"
      >
        <el-option
          v-for="(item, index) in articleClass"
          :key="index"
          :label="item.dicName"
          :value="item.dicCode"
        />
      </el-select>
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
import { reactive, ref, defineEmits, defineProps } from "vue";
import { DataDictionaryControllerGetListByDicClass } from "@/api/DataDictionaryControllerApi";
const searchFormRef = ref<FormInstance>();
const searchForm = ref({
  keyWord: "",
  articleClass: "",
});

const emit = defineEmits(["handleSearch"]);
const props = defineProps(["placeholder"]);

const articleClass = ref<any[]>([
  {
    dicName: "全部",
    dicCode: "",
  },
]);

// 获取文章分类字典
const getArticleDictionary = async (dicCode: string) => {
  try {
    let result = await DataDictionaryControllerGetListByDicClass(dicCode);
    let data = result.data;
    if (data.status === 1)
      articleClass.value = [...articleClass.value, ...data.data];
  } catch (err) {
    return;
  }
};
getArticleDictionary("DC0001");

const onSubmit = () => {
  emit("handleSearch", searchForm.value);
};

const onResetForm = () => {
  searchForm.value = {
    keyWord: "",
    articleClass: "",
  };
  emit("handleSearch", searchForm.value);
};
</script>
