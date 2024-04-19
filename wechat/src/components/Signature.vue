<template>
  <div class="box">
    <div class="top">
      <l-signature
        disableScroll
        ref="signatureRef"
        :penSize="6"
        :openSmooth="true"
        :boundingBox="true"
        :landscape="true"
        backgroundColor="#fff"
      ></l-signature>
    </div>
    <div class="operation">
      <div class="right">
        <u-button @click="clear" :custom-style="btnStyle"> 清除重写 </u-button>
        <u-button
          @click="confirm"
          :loading="loading"
          :custom-style="{ ...btnStyle, background: '#6286ff', color: '#fff' }"
        >
          确认提交
        </u-button>
      </div>
      <div class="tips">请在空白区域签名</div>
    </div>
  </div>
</template>
<script>
import lSignature from "lime-signature/components/l-signature/l-signature";
import { uploadPrivate } from "utils/request";
export default {
  components: { lSignature },
  emits: ["confirm"],
  props: { loading: { type: Boolean, default: true } },
  data() {
    return {
      btnStyle: {
        width: "178rpx",
        height: "82rpx",
        borderRadius: "40rpx",
        margin: "0 10rpx",
        border: "2px solid #6286ff",
        color: "#6286ff",
        lineHeight: "72rpx",
        textAlign: "center",
        fontSize: "28rpx",
        marginBottom: "20rpx",
      },
    };
  },
  methods: {
    clear() {
      this.$refs.signatureRef.clear();
    },
    confirm() {
      this.$refs.signatureRef.canvasToTempFilePath({
        success: async (res) => {
          // 是否为空画板 无签名
          console.log("签名结果", { res });
          const { isEmpty, tempFilePath } = res;
          if (isEmpty) {
            this.alertInfo("请签名后在提交");
          } else {
            // const fs = uni.getFileSystemManager();
            // const base64 = fs.readFileSync(tempFilePath, "base64");
            // const img = `data:image/jpg;base64,${base64}`;
            let { data: res } = await uploadPrivate(tempFilePath);
            if (typeof res == "string") {
              res = JSON.parse(res);
            }
            const { status, data, message } = res;
            if (status === 1) {
              const { url } = data;
              this.$emit("confirm", url);
            } else {
              this.alertInfo(message);
            }
          }
        },
      });
    },
  },
};
</script>
<style lang="scss" scope>
.box {
  width: 750rpx;
  height: 100vh;
  .top {
    height: calc(100vh - 188rpx);
  }
  .operation {
    display: flex;
    position: fixed;
    bottom: 0;
    justify-content: flex-start;
    width: 710rpx;
    height: 168rpx;
    align-items: center;
    padding: 20rpx;
    background-color: #fff;

    .tips {
      color: #666;
      width: 28rpx;
      transform: rotate(90deg);
      margin-left: 218rpx;
    }
    .right {
      transform: rotate(90deg);
    }
  }
}
</style>
