<template>
  <div>
    <uni-popup type="dialog" ref="popup" background-color="#fff">
      <uni-popup-dialog
        mode="input"
        :duration="2000"
        :title="title"
        :before-close="true"
        :confirmText="confirmText"
        @close="close"
        @confirm="confirm"
      >
        <Pay
          v-if="value"
          :orderUUID="orderUUID"
          :model="model"
          @success="success"
          ref="pay"
        ></Pay>
      </uni-popup-dialog>
    </uni-popup>
  </div>
</template>
<script>
import Pay from "components/pay/Pay";
export default {
  components: { Pay },
  props: {
    value: { type: Boolean, default: false },
    orderUUID: { type: String },
    model: { type: Array, default: ["wechat", "wallet"] },
  },
  emits: ["confirm"],
  data() {
    return {
      confirmText: "确定",
      title: "选择支付方式",
    };
  },
  watch: {
    value(v) {
      if (v === true) {
        this.open();
        this.title = "选择支付方式";
        this.confirmText = "确定";
      } else if (v === false) {
        this.close();
      }
    },
  },
  mounted() {
    console.log({ value: this.value });
    if (this.value === true) {
      this.open();
    }
  },
  methods: {
    open() {
      console.log("打开弹框");
      this.$refs.popup.open();
    },
    close() {
      if (this.value) {
        console.log("关闭");
        this.$emit("input", false);
      }
      this.$refs.popup.close();
    },
    confirm() {
      console.log("确定");
      this.$refs.pay.confirm();
      this.confirmText = "确认支付";
      this.title = "确认支付";
    },
    success() {
      this.$emit("success");
    },
  },
};
</script>
