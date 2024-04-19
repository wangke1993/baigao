<template>
  <div class="box" @click="toPage(`${url}?scene=${scene}`)">
    <img v-if="qr" :src="qr" />
  </div>
</template>
<script>
import { WeChatApiControllerCreateWeChatQR } from "api/WeChatApiControllerApi.js";
export default {
  // url;不要以“/”开头
  props: { url: { type: String }, scene: { type: String } },
  watch: {
    scene(n) {
      console.log("scene变化", n);
      this.getQR();
    },
  },
  mounted() {
    this.getQR();
  },
  data() {
    return {
      qr: "",
    };
  },
  methods: {
    async getQR() {
      const {
        data: { status, data, message },
      } = await WeChatApiControllerCreateWeChatQR({
        page: this.url,
        scene: this.scene,
      });
      if (status === 1) {
        this.qr = data;
      } else {
        this.alertInfo(message);
      }
    },
  },
};
</script>
<style lang="scss" scope>
.box {
  display: flex;
  justify-content: center;
  img {
    width: 288rpx;
    height: 288rpx;
  }
}
</style>
