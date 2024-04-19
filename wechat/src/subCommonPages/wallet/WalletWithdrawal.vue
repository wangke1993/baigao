<template>
  <div class="box">
    <div class="top">
      <div class="title">提现金额</div>
      <div class="all" @click="amount = money(balance)">全部提现</div>
    </div>

    <div class="content">
      <span>￥</span>
      <input v-model="amount" @input="limitNum(amount)" />
    </div>
    <div class="tips">
      当前余额为<span>{{ money(balance) }}</span> 元，单次最高提现
      <span>{{ withdrawableEveryTime }}</span> 元
    </div>
    <div class="detail" @click="toArticle(elaborateOn)" v-if="elaborateOn">
      详细说明
    </div>
    <u-button
      :loading="loading.withdrawal"
      :disabled="amount <= 0"
      @click="withdrawal()"
      :custom-style="{
        ...btnStyle,
      }"
    >
      立即提现
    </u-button>
    <u-button
      @click="toPage(`WithdrawalApplication`)"
      :custom-style="{
        ...btnStyle,
        background: '#fff',
        color: '#6286ff',
        border: '6rpx solid #6286ff',
        marginTop: '18rpx',
      }"
    >
      提现记录
    </u-button>
  </div>
</template>
<script>
import { MemberManagementControllerGetMemberWallet } from "api/MemberManagementControllerApi.js";
import { WithdrawalManagementControllerWalletWithdrawalApplication } from "api/WithdrawalManagementControllerApi.js";
export default {
  components: {},
  data() {
    return {
      loading: {
        withdrawal: false,
      },
      amount: 0,
      balance: 0,
      withdrawableEveryTime: 0,
      elaborateOn: "",
      wallet: {},
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
  async mounted() {
    await this.init();
  },
  methods: {
    async withdrawal() {
      this.loading.withdrawal = true;
      const {
        data: { status, message },
      } = await WithdrawalManagementControllerWalletWithdrawalApplication(
        this.userPort,
        this.amount * 100
      );
      this.loading.withdrawal = false;
      if (status === 1) {
        this.alertInfo("提现申请已提交，请等待审核");
      } else {
        this.alertInfo(message);
      }
    },
    async init() {
      const {
        data: { status, data, message },
      } =
        this.userPort == "default"
          ? await MemberManagementControllerGetMemberWallet()
          : {};
      if (status === 1) {
        console.log("钱包", data);
        this.wallet = data;
        this.balance = data.balance;
      } else {
        this.alertInfo(message);
      }
      /**
       * DC00390004:会员提现上限
       * DC00390003:会员提现说明
       * DC00390005:员工提现上限
       * DC00390006:员工提现说明
       */
      // if (this.userPort == "default") {
      //   const conf = await this.getSystemConfValue("DC00390003,DC00390004");
      //   this.withdrawableEveryTime = JSON.parse(conf["DC00390004"]);
      //   this.elaborateOn = conf["DC00390003"];
      // } else {
      //   const conf = await this.getSystemConfValue("DC00390006,DC00390005");
      //   this.withdrawableEveryTime = JSON.parse(conf["DC00390005"]);
      //   this.elaborateOn = conf["DC00390006"];
      // }
    },
    //第一种方案：用户输入01、02等，则展示成1、2，等于非小数时过滤第一位0
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
  .top {
    font-size: 32rpx;
    margin-bottom: 40rpx;
    margin-top: 72rpx;
    display: flex;
    justify-content: space-between;
    .title {
      color: #1d2541;
    }
    .all {
      color: #3565c5;
    }
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
  .tips {
    font-size: 28rpx;
    color: #6b7390;
    margin-top: 20rpx;
    span {
      color: #1d2541;
      font-weight: bold;
    }
  }
  .detail {
    margin-top: 10rpx;
    font-size: 28rpx;
    color: #8fb3ff;
  }
  .button {
    width: 630rpx;
    height: 100rpx;
    margin: 0 auto;
    margin-top: 80rpx;
    color: #fff;
    text-align: center;
    line-height: 100rpx;
    background: linear-gradient(270deg, #5659ff 0%, #69a3ff 100%);
    border-radius: 56rpx;
  }
}
</style>
