<template>
  <el-image
    style="width: 100%"
    :src="url"
    :preview-src-list="[url]"
    :initial-index="1"
    fit="scale-down"
  ></el-image>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getPrivateFile } from "@/utils/request";
import { alertWarning } from "@/utils/message";

const props = defineProps({ src: { type: String } });
const url = ref<string>();
const loading = ref(false);
onMounted(async () => {
  if (props?.src) {
    loading.value = true;
    url.value = await getPrivateFile(props.src);
    loading.value = false;
  } else {
    alertWarning("图片地址为空无法加载");
  }
});
</script>
