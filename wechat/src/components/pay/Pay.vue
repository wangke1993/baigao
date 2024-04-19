<template>
  <div class="box">
    <div class="one" v-if="step === 'one'">
      <u-radio-group placement="column" v-model="value">
        <div v-if="model.includes('wechat')" class="item">
          <img src="/static/icon/icon-wechat-pay.png" />
          <u-radio name="wechat" label="微信"></u-radio>
        </div>
        <div v-if="model.includes('wallet')" class="item">
          <img class="wallet" src="/static/icon/icon-wallet.png" alt="icon" />
          <u-radio name="wallet" label="微信 + 钱包"></u-radio>
        </div>
      </u-radio-group>
    </div>
    <div class="tow" v-if="step == 'two'">
      <div class="wechat" v-if="value == 'wechat'">
        <img src="/static/icon/icon-wechat-pay.png" />
        <span>{{ money(weChatPayment) }} 元</span>
      </div>
      <div class="wallet" v-else>
        <div class="item">
          <div class="title">钱包支付：</div>
          <div class="money">{{ money(walletPayment) }} 元</div>
        </div>
        <div class="item">
          <div class="title">微信支付：</div>
          <div class="money">{{ money(weChatPayment) }} 元</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MemberManagementControllerGetMemberWallet } from "api/MemberManagementControllerApi.js";
import {
  OrderPayControllerOrderPay,
  OrderPayControllerOrderWalletRefund,
  OrderPayControllerQueryOrderPay,
} from "api/OrderPayControllerApi.js";
export default {
  props: {
    orderUUID: { type: String },
    model: { type: Array, default: ["wechat", "wallet"] },
  },
  emit: ["success"],
  data() {
    return {
      step: "one",
      value: "wechat",
      orderAmount: 0,
      walletBalance: 0,
    };
  },
  computed: {
    weChatPayment() {
      if (this.value == "wechat") {
        return this.orderAmount;
      } else {
        if (this.walletBalance > this.orderAmount) {
          return 0;
        } else {
          return this.orderAmount - this.walletBalance;
        }
      }
    },
    walletPayment() {
      if (this.orderAmount < this.walletBalance) {
        return this.orderAmount;
      } else {
        return this.walletBalance;
      }
    },
  },
  methods: {
    async confirm() {
      if (this.step == "one") {
        /**
         * 获取订单金额
         * 获取钱包余额
         */
        uni.showLoading({ title: "加载中" });
        const {
          data: { status, data, message },
        } = {};
        if (status === 1) {
          this.orderAmount = data.order.totalAmount;
          if (this.value === "wallet") {
            const {
              data: { status: st, data: wallet, message: msg },
            } = await MemberManagementControllerGetMemberWallet();
            if (st === 1) {
              this.walletBalance = wallet.balance;
              this.step = "two";
            } else {
              this.alertInfo(msg);
            }
          } else {
            this.step = "two";
          }
        } else {
          this.alertInfo(message);
        }
        uni.hideLoading();
      } else {
        this.pay();
      }
    },
    async success() {
      this.$emit("success");
    },
    async pay() {
      console.log("支付");
      /**
       * 支付和订单业务组合
       */
      uni.showLoading({
        title: "支付中",
      });
      const {
        data: { status, data, message },
      } = await OrderPayControllerOrderPay(this.orderUUID, this.value);
      uni.hideLoading();

      // 需要使用调用微信支付
      if (status === 1) {
        if (this.weChatPayment > 0 && data) {
          const that = this;
          const { timeStamp, nonceStr, signType, paySign, package: pkg } = data;
          uni.requestPayment({
            provider: "wxpay",
            timeStamp,
            nonceStr,
            package: pkg,
            signType,
            paySign,
            async success(res) {
              console.log("支付成功", res);

              uni.showLoading({ title: "查询支付结果" });
              // 查询2次
              const {
                data: { status, data, message },
              } = await OrderPayControllerQueryOrderPay(that.orderUUID);
              uni.hideLoading();
              if (status === 1) {
                if (data == true) {
                  that.alertInfo("支付成功");
                  that.success();
                } else {
                  that.alertInfo("支付结果查询失败，请30s后刷新同步支付状态");
                }
              } else {
                that.alertInfo(message);
              }
            },
            fail(e) {
              console.log("支付失败", e);
              if (e?.errMsg.indexOf("fail cancel") >= 0) {
                that.alertInfo("用户取消支付");
              } else {
                that.alertInfo(e?.errMsg);
              }
              OrderPayControllerOrderWalletRefund(that.orderUUID);
            },
          });
        } else {
          if (data == true) {
            this.alertInfo("支付成功");
            this.success();
          }
        }
      } else {
        this.alertInfo(message);
      }
    },
  },
};
</script>
<style lang="scss" scope>
.box {
  .one {
    .item {
      display: flex;
      margin-top: 18rpx;
      img {
        height: 58rpx;
        width: 58rpx;
        margin: 0 8rpx;
      }
      .wallet {
        height: 50rpx;
        width: 50rpx;
      }
    }
  }
  .tow {
    .wechat {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        height: 108rpx;
        width: 108rpx;
      }
      span {
        font-weight: 700;
        font-size: 68rpx;
      }
    }
    .item {
      display: flex;
      margin-top: 8rpx;
      color: #6b7390;
      .title {
        font-weight: 700;
      }
    }
  }
}
</style>
