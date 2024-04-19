<template>
  <div class="box">
    <div v-if="isLogin">我是首页</div>
    <div class="no-login" v-else>登录中...</div>
  </div>
</template>
<script></script>
<style lang="scss" scoped>
.box {
  background-color: #ebedf3;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 120rpx;
  .no-login {
    text-align: center;
    line-height: 188rpx;
  }
}
</style>
