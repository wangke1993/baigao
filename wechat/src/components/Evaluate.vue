<template>
  <div class="box">
    <u-form :model="form" :label-style="{ fontWeight: 700 }" ref="uForm">
      <u-form-item label="评分">
        <u-rate
          count="5"
          size="25"
          active-color="rgb(255, 180, 9)"
          gutter="2"
          :readonly="disabled"
          v-model="form.rate"
        >
        </u-rate>
      </u-form-item>
      <u-form-item label="评价">
        <u--textarea
          type="text"
          v-model="form.content"
          v-if="!disabled"
          placeholder="请输入评价内容"
          height="88"
        ></u--textarea>
        <template v-else> {{ form.content }} </template>
      </u-form-item>
      <u-button
        v-if="!disabled"
        @click="submit"
        :loading="loading"
        :disabled="loading"
        type="primary"
        text="提交评价"
      ></u-button>
    </u-form>
  </div>
</template>
<script>
import { EvaluateManagementControllerCreate } from "api/EvaluateManagementControllerApi";
export default {
  props: {
    order: {
      type: Object,
      default: {
        accountManager: {},
        apInfo: {},
        order: {},
        serviceOrder: {},
        servicePersonnel: {},
      },
    },
    evaluationObject: { type: String },
    title: { type: String },
    evaluateType: { type: String },
    data: { type: Object },
  },
  mounted() {
    if (this.data) {
      this.form = this.data;
      this.disabled = true;
    }
  },
  data() {
    return {
      disabled: false,
      loading: false,
      form: {
        memberUUID: "",
        evaluateType: "",
        evaluateTypeText: "",
        dataUUID: "",
        title: "",
        rate: 5,
        content: "",
        evaluationObject: "",
      },
    };
  },
  methods: {
    async submit() {
      console.log("提交订单");
      const evaluateTypeText = {
        DC00100001: "订单评价",
        DC00100002: "人员评价",
      };

      this.form.memberUUID = this.order.order.memberUUID;
      this.form.dataUUID = this.order.order.UUID;
      this.form.evaluateType = this.evaluateType;
      this.form.evaluationObject = this.evaluationObject;
      this.form.evaluateTypeText = evaluateTypeText[this.evaluateType];
      this.form.title = this.title;
      uni.showModal({
        content: "提交后不可修改，确定提交吗？",
        success: async (res) => {
          if (res.confirm) {
            this.loading = true;
            const {
              data: { status, data, message },
            } = await EvaluateManagementControllerCreate(this.form);
            this.loading = false;
            if (status === 1) {
              // 刷新评价列表
              this.$emit("refresh");
            } else {
              this.alertInfo(message);
            }
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  padding: 18rpx;
  padding-left: 28rpx;
  box-sizing: border-box;
}
</style>
