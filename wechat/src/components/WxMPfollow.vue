<template>
  <div v-if="show" class="follow">
    <div class="tips">关注公众号，以接收订单通知</div>
    <official-account @load="bindload" @error="binderror"></official-account>
  </div>
</template>
<script>
import { WeChatApiControllerVerifyWeChatBinding } from "api/WeChatApiControllerApi.js";
export default {
  data() {
    return {
      show: true,
    };
  },
  methods: {
    bindload(e) {
      console.log("公众号展示成功", e);
    },
    binderror(e) {
      console.log("公众号展示失败", e);
    },
    async init() {
      const {
        data: { data, status, message },
      } = await WeChatApiControllerVerifyWeChatBinding();
      if (status === 1) {
        this.show = !data;
      } else {
        this.alertInfo(message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.follow {
  padding: 18rpx;
  .tips {
    text-align: center;
    margin: 18rpx auto;
    font-weight: 700;
  }
}
</style>
