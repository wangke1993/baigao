<template>
  <div class="box">
    <!-- <div class="item">
      <img src="/static/icon/addr.png" />
      <div>地址管理</div>
    </div> -->
    <div v-if="aboutUs" @click="toArticle(aboutUs)" class="item">
      <img class="img" src="/static/icon/about.png" />
      <div>关于我们</div>
    </div>
    <div @click="toPage('/pages/auth/privacyAgreement')" class="item">
      <img class="img" src="/static/icon/about.png" />
      <div>隐私政策</div>
    </div>
    <div @click="toPage('/pages/auth/userAgreement')" class="item">
      <img class="img" src="/static/icon/about.png" />
      <div>用户协议</div>
    </div>
    <div v-if="!bindPhone" @click="login()" class="item phone">
      <img class="img" src="/static/icon/phone.png" />
      <div>绑定手机号</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      joinUs: "",
      aboutUs: "",
    };
  },
  mounted() {
    // this.init();
  },
  methods: {
    async init() {
      // const conf = await this.getSystemConfValue("DC00390001,DC00390002");
      // this.joinUs = conf["DC00390001"];
      // this.aboutUs = conf["DC00390002"];
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  margin-bottom: 80rpx;
  .item {
    height: 108rpx;
    display: flex;
    margin: 0 40rpx;
    box-sizing: border-box;
    align-items: center;
    font-size: 28rpx;
    border-bottom: 1px solid #eee8;
    .img {
      height: 80rpx;
      width: 80rpx;
    }
  }
  .phone {
    .img {
      height: 60rpx;
      width: 60rpx;
      margin-right: 20rpx;
    }
  }
}
</style>
