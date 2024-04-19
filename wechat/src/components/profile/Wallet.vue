<template>
  <div class="box" v-if="data">
    <div class="left">
      <div class="title">
        <div class="tips">账户余额</div>
        <div
          class="detail"
          @click="
            toPage(`/subCommonPages/wallet/WalletDetails?UUID=${data.UUID}`)
          "
        >
          （点击查看明细）
        </div>
      </div>
      <div
        @click="
          toPage(`/subCommonPages/wallet/WalletDetails?UUID=${data.UUID}`)
        "
        class="balance"
      >
        ￥{{ money(balance) }}
      </div>
    </div>
    <div class="right">
      <div
        class="item recharge"
        @click="
          toPage(
            `/subCommonPages/wallet/RechargeWallet?walletUUID=${data.UUID}`
          )
        "
      >
        充值
      </div>
      <div
        class="item withdrawal"
        @click="toPage('/subCommonPages/wallet/WalletWithdrawal')"
      >
        提现
      </div>
    </div>
  </div>
</template>
<script>
import { MemberManagementControllerGetMemberWallet } from "api/MemberManagementControllerApi.js";

export default {
  data() {
    return {
      balance: 0,
      data: null,
    };
  },
  async mounted() {
    // await this.init();
  },
  methods: {
    async init() {
      this.balance = 0;
      if (this.userPort == "manger") {
        return;
      }
      const {
        data: { status, data, message },
      } =
        this.userPort == "default"
          ? await MemberManagementControllerGetMemberWallet()
          : {};
      if (status === 1) {
        console.log("钱包", data);
        this.balance = data.balance;
        this.data = data;
      } else {
        this.alertInfo(message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  width: 670rpx;
  height: 140rpx;
  background-image: url("/static/background/wallet.png");
  margin: 0 auto;
  margin-bottom: 40rpx;
  background-size: 670rpx 140rpx;
  background: linear-gradient(270deg, #000000 5%, #875811 97%);
  border-radius: 16rpx;
  color: #fff;
  padding-left: 40rpx;
  padding-right: 20rpx;
  display: flex;
  position: relative;
  box-sizing: border-box;
  .left {
    margin-top: 22rpx;
    .title {
      font-size: 24rpx;
      margin-bottom: 6rpx;
      display: flex;
      .detail {
        color: #fff;
        /* color: #3565c5; */
      }
    }
    .balance {
      font-size: 42rpx;
      font-weight: 700;
    }
  }
  .right {
    margin-left: auto;
    margin-top: 40rpx;
    display: flex;
    .item {
      width: 128rpx;
      height: 58rpx;
      margin: 0 10rpx;
      border-radius: 29rpx;
      text-align: center;
      font-size: 24rpx;
      font-weight: bold;
      line-height: 50rpx;
      box-sizing: border-box;
    }
    .recharge {
      background: linear-gradient(180deg, #ffdd8d 0%, #7b4e0a 100%);
    }
    .withdrawal {
      color: #d8ad5d;
      border: 2px solid #af8127;
    }
  }
}
</style>
