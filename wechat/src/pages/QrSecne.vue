<template>
  <div class="box">扫码进入页面示例</div>
</template>
<script>
import { UserPort } from "@/utils/state.js";
export default {
  data() {
    return {
      scene: "",
    };
  },
  watch: {
    portList(n) {
      if (n.length > 0) {
        this.load();
      }
    },
  },
  methods: {},
  onLoad(query) {
    const appConf = uni.getEnterOptionsSync();
    const QRCode = [1047, 1048, 1049, 1007, 1008, 1154, 1155];
    if (QRCode.includes(appConf?.scene) && query?.scene) {
      if (query.scene) {
        // 扫码进入时需要设置扫码进入标识，避免userPort模块直接跳转到当前角色首页
        this.setScanCode(true);
        this.scene = query.scene;
      }
    }
  },
};
</script>
<style scoped>
.box {
  height: 100vh;
  width: 100%;
  text-align: center;
  line-height: 100vh;
}
</style>
