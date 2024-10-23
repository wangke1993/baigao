<template>
  <div class="image-container">
    <el-image
      style="width: 100%"
      :src="url"
      :preview-src-list="previewSrcList"
      :initial-index="1"
      fit="cover"
      preview-teleported="true"
      :zoom-rate="0.8"
      loading="lazy"
    ></el-image>
    <slot :url="url"></slot>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getPrivateFile } from "@/utils/request";
import { alertWarning } from "@/utils/message";

const props = defineProps({
  src: { type: String },
  srcArr: { type: Array<string>, default: () => [] },
});
const url = ref<string>();
const loading = ref(false);
const previewSrcList = ref(new Array<string>());
const getPrivateFileUrl = async (src: string) => {
  if (src.startsWith("blob")) {
    return src;
  } else {
    return await getPrivateFile(src);
  }
};

onMounted(async () => {
  if (props?.src || props.srcArr.length > 0) {
    loading.value = true;
    if (props.srcArr.length > 0) {
      url.value = await getPrivateFileUrl(props.srcArr[0]);
      previewSrcList.value = await Promise.all(
        props.srcArr.map(async (item) => await getPrivateFileUrl(item))
      );
    } else if (props.src) {
      url.value = await getPrivateFileUrl(props.src);
      previewSrcList.value = [url.value];
    }
    loading.value = false;
  } else {
    alertWarning("图片地址为空无法加载");
  }
});
</script>
