<template>
  <el-form :inline="true" :model="searchForm" class="demo-form-inline">
    <el-form-item>
      <slot></slot>
    </el-form-item>
    <el-form-item label="模糊搜索：">
      <el-input v-model="searchForm.keyWord" placeholder="审核人/备注" />
    </el-form-item>
    <el-form-item label="审核状态:">
      <el-select
        style="width: 100%"
        v-model="searchForm.status"
        clearable
        placeholder="请选择审核状态"
      >
        <el-option
          v-for="item in statusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="提现类型:">
      <el-select
        style="width: 100%"
        v-model="searchForm.withdrawal"
        clearable
        placeholder="请选择提现类型"
      >
        <el-option
          v-for="item in withdrawalSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
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

import { SelectDto } from "@/common/CommonDto";

class SearchDto {
  keyWord?: string;
  status?: string;
  withdrawal?: string;
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

watch(
  () => searchForm.value.status,
  () => {
    emit("search", searchForm.value);
  }
);
watch(
  () => searchForm.value.withdrawal,
  () => {
    emit("search", searchForm.value);
  }
);

// 获取select数据
const statusSelect = ref(new Array<SelectDto<any>>());
const getStatusSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/admin/dic/getList/DC0015");
  if (status === 1) {
    data.map((item: any) => {
      statusSelect.value.push(
        new SelectDto<any>(item["dicName"], item["value"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getStatusSelect();
// 获取select数据
const withdrawalSelect = ref(new Array<SelectDto<any>>());
const getWithdrawalSelect = async () => {
  const {
    data: { status, data, message },
  } = await axios.get("/api/admin/dic/getList/DC0014");
  if (status === 1) {
    data.map((item: any) => {
      withdrawalSelect.value.push(
        new SelectDto<any>(item["dicName"], item["dicCode"])
      );
    });
  } else {
    alertWarning(message);
  }
};
getWithdrawalSelect();
</script>
