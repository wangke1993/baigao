<template>
  <div class="box">
    <div class="title" :class="{ red: balance <= 0 }">
      钱包余额：{{ money(balance) }}元
    </div>
    <div class="title">充值金额</div>
    <div class="content">
      <span>￥</span>
      <input v-model="amount" @input="limitNum(amount)" />
    </div>
    <u-button
      :loading="loading.recharge"
      :disabled="amount <= 0"
      @click="createOrder"
      :custom-style="{
        ...btnStyle,
      }"
    >
      立即充值
    </u-button>
  </div>
</template>
<script>
import {
  MemberManagementControllerGetMemberWallet,
  MemberManagementControllerGetMemberWalletByManger,
} from "api/MemberManagementControllerApi.js";

export default {
  components: {},
  data() {
    return {
      balance: 0,
      data: null,
      auxiliary: false,
      memberUUID: "",
      amount: 0,
      walletUUID: "",
      loading: { recharge: false },
      btnStyle: {
        width: "630rpx",
        height: "100rpx",
        margin: "0 auto",
        marginTop: "80rpx",
        color: "#fff",
        textAlign: "center",
        lineHeight: "100rpx",
        background: "linear-gradient(270deg, #5659ff 0%, #69a3ff 100%)",
        borderRadius: "56rpx",
      },
    };
  },
  onLoad(query) {
    // 辅助充值
    if (query.auxiliary == 1) {
      this.auxiliary = true;
      this.memberUUID = query.memberUUID;
    } else {
      this.auxiliary = false;
    }
  },
  onShow() {
    this.amount = 0;
    this.init();
  },
  methods: {
    async init() {
      this.balance = 0;
      const {
        data: { status, data, message },
      } =
        this.userPort == "default"
          ? await MemberManagementControllerGetMemberWallet()
          : this.auxiliary
          ? await MemberManagementControllerGetMemberWalletByManger(
              this.memberUUID
            )
          : {};
      if (status === 1) {
        console.log("钱包", data);
        this.balance = data.balance;
        this.data = data;
        this.walletUUID = data.UUID;
      } else {
        this.alertInfo(message);
      }
    },
    async createOrder() {
      this.loading.recharge = true;
      const param = {
        rechargeType: "DC00260006",
        dataUUID: this.walletUUID,
        money: this.amount * 100,
        auxiliary: this.auxiliary,
      };
      const {
        data: { status, data, message },
      } = {};
      this.loading.recharge = false;
      if (status === 1) {
        this.toPage(`/subCommonPages/order/Detail?UUID=${data.UUID}`);
      } else {
        this.alertInfo(message);
      }
    },
    //用户输入01、02等，则展示成1、2，等于非小数时过滤第一位0
    limitNum(amount) {
      amount = amount
        .replace(/[^\d.]/g, "") //只能输入数字
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3") //只能输入两个小数
        .replace(/\.{2,}/g, "."); //出现多个点时只保留第一个
      // 第一位不让输小数点
      if (amount == ".") {
        amount = "";
      }
      // 如果第一位是0，第二位必须大于0或者小数点
      if (amount.substring(0, 1) == 0) {
        if (amount.substring(1, 2) > 0) {
          amount = amount.substring(1, 2);
        } else if (
          amount.substring(1, 2) === 0 ||
          amount.substring(1, 2) === "0"
        ) {
          amount = "0";
        }
      } else {
        // 如果第一位数字大于0（不等于0肯定就大于0），仅需考虑第二位是小数点的情况
        if (amount.indexOf(".") !== -1) {
          if (amount.substring(0, 1) > 0) {
            console.log("第一位大于0");
          } else {
            console.log("第一位等于0");
            if (amount.substring(2, 3) > 0) {
              console.log("小数点后第一位大于0");
            } else {
              console.log("小数点后第一位等于0");
              amount = "0.";
            }
          }
        } else {
          console.log("没有小数点，正常输入");
        }
      }
      setTimeout(() => {
        this.amount = amount;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  padding: 0 60rpx;

  .title {
    color: #1d2541;
    font-size: 32rpx;
    margin-bottom: 40rpx;
    margin-top: 72rpx;
  }
  .content {
    color: #1d2541;
    font-size: 120rpx;
    font-weight: bold;
    padding-bottom: 40rpx;
    border-bottom: 2rpx solid #f4f5fa;
    display: flex;
    align-items: center;
    input {
      margin-left: 28rpx;
      height: 120rpx;
    }
  }
  .red {
    color: red;
  }
}
</style>
