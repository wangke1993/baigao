<template>
  <el-dialog v-model="state.dialogFormVisible" title="购买审核" :close-on-press-escape="false" :close-on-click-modal="false"
    width="70%" @closed="closeForm()">
    <OrderIndex v-if="state.dialogFormVisible" :goodsUUID="state.goodsUUID" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import OrderIndex from '@/views/orderManger/Index.vue';
const OrderIndexRef = ref();
const state = ref({
  dialogFormVisible: false,
  goodsUUID: '',
})
const open = (goodsUUID: string) => {
  state.value.dialogFormVisible = true;
  state.value.goodsUUID = goodsUUID;
};
// 右上角关闭
const closeForm = () => {
  state.value.dialogFormVisible = false;
};
defineExpose({ open });
</script>