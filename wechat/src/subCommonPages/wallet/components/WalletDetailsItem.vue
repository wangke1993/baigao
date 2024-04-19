<template>
  <div class="box">
    <div class="title">
      {{ data.remarks }}
    </div>
    <div class="time">
      <Dateformat
        :date="data.addDate"
        format="yyyy-MM-dd hh:mm:ss"
      ></Dateformat>
    </div>
    <div class="money">
      <div class="tips">{{ data.logTypeText }}</div>
      <div class="price" :class="{ red: data.logType < 0 }">
        {{ data.logType > 0 ? "+" : "-" }} ￥ {{ money(data.amount) }}
      </div>
    </div>
    <div class="money">
      <div class="tips">余额</div>
      <div class="price" :class="{ red: data.logType < 0 }">
        ￥ {{ money(data.balance) }}
      </div>
    </div>
  </div>
</template>
<script>
import Dateformat from '../../../components/Dateformat.vue';

export default {
    props: { data: { type: Object } },
    components: { Dateformat }
};
</script>
<style lang="scss" scoped>
.box {
  width: 670rpx;
  min-height: 240rpx;
  border-bottom: 2rpx solid #f4f5fa;
  padding: 40rpx 0;
  margin: 0 auto;
  background-color: #fff;
  box-sizing: border-box;
  .title {
    font-size: 28rpx;
    color: #1d2541;
  }
  .time {
    font-size: 24rpx;
    color: #6b7390;
    margin: 30rpx 0;
  }
  .money {
    display: flex;
    justify-content: space-between;
    margin: 30rpx 0;
    .tips {
      font-size: 24rpx;
      color: #6b7390;
    }
    .price {
      font-size: 28rpx;
      font-weight: bold;
      /* color: #1d2541; */
      color: green;
      &.red {
        color: red;
      }
    }
  }
}
</style>
