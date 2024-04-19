<template>
  <div class="box">
    <el-avatar :size="50" :src="'/api' + props.src" />
    <div class="name">{{ props.name }}</div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  name: { type: String },
  src: { type: String },
});
</script>
<style scoped>
.box {
  width: 50px;
  .name {
    text-align: center;
  }
}
</style>
