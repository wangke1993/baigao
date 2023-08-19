<template>
  <div @click="a++">数据统计{{ a }}</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const a = ref(0);
</script>
<script lang="ts">
export default {
  name: "dashboard",
};
</script>
<style></style>
