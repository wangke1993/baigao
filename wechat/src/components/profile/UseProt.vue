<template>
  <div class="box">
    <template v-if="userPort === 'default'">
      <div
        @click="to('servicePersonnel')"
        v-if="portList.includes('servicePersonnel')"
        class="item"
      >
        <img src="/static/icon/user-port.png" />
        <span>进入员工端</span>
      </div>
      <div
        @click="to('manger')"
        v-if="portList.includes('manger')"
        class="item"
      >
        <img src="/static/icon/manger.png" />
        <span>进入管理端</span>
      </div>
    </template>
    <template v-else>
      <div @click="to('default')" class="item">
        <img src="/static/icon/user-port.png" />
        <span>进入用户端</span>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    async to(port) {
      this.setUserPort(port);
      if (port !== "default") {
        this.CheckUserPort();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  .item {
    width: 260rpx;
    height: 80rpx;
    border-radius: 40rpx;
    background: #f4f5fa;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1d2541;
    font-size: 24rpx;
    margin: 0 10rpx;
    img {
      margin-right: 10rpx;
      width: 48rpx;
      height: 48rpx;
    }
    span {
      font-weight: normal;
    }
  }
}
</style>
