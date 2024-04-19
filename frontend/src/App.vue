<template>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
</script>
<style>
#app {
  width: 100%;
  height: 100%;
}
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px; /* 定义滚动条宽度 */
}

/* 滑块样式 */
::-webkit-scrollbar-thumb {
  border-radius: 6px; /* 定义滑块圆角 */
  background-color: #8885; /* 定义滑块背景颜色 */
}

/* 滑块悬停样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: #5555; /* 定义滑块悬停时的背景颜色 */
}
</style>
