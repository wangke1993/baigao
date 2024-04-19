<template>
  <div class="box">
    <z-paging
      ref="zPage"
      v-model="dataList"
      @onRestore="onRestore"
      @query="queryList"
      :fixed="false"
      v-if="isLogin"
    >
      <UserInfo ref="userInfoRef" />
      <Wallet
        v-if="userPort != 'manger' && userInfo.userName != ''"
        ref="walletRef"
      />
      <MenuList ref="menuListRef" />
      <!-- #ifdef MP-WEIXIN -->
      <!-- 微信关注组件根据业务情况决定是否开启 -->
      <!-- <WxMPfollow
        ref="wxMpFollowRef"
      ></WxMPfollow> -->
      <!-- #endif -->
      <UseProt />
      <template #empty> </template>
    </z-paging>
  </div>
</template>
<script>
import UserInfo from "../components/profile/UserInfo.vue";
import Wallet from "../components/profile/Wallet.vue";
import MenuList from "../components/profile/MenuList.vue";
import WxMPfollow from "../components/WxMPfollow.vue";
export default {
  components: {
    UserInfo,
    Wallet,
    MenuList,
    WxMPfollow,
  },
  data() {
    return {
      dataList: [],
      first: true,
    };
  },
  onShow() {
    this.init();
  },
  methods: {
    onRestore() {
      this.init();
    },
    queryList() {
      this.init();
    },
    init() {
      if (this.$refs.walletRef) {
        // 获取钱包数据
        this.$refs.walletRef.init();
      }
      if (this.$refs.menuListRef) {
        // 获取菜单数据
        this.$refs.menuListRef.init();
      }
      if (this.$refs.userInfoRef) {
        // 获取用户信息
        this.$refs.userInfoRef.init();
      }
      if (this.$refs.wxMpFollowRef) {
        // 获取微信公众号关注信息
        this.$refs.wxMpFollowRef.init();
      }
      this.$refs.zPage.complete([]);
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100vh;
  background: linear-gradient(#c2d1ff, #ffffff);
  background-size: 100% 312rpx;
  background-repeat: no-repeat;
  padding-bottom: 120rpx;
  .slogan {
    padding-top: 100rpx;
    padding-bottom: 40rpx;
    text-align: center;
    font-size: 28rpx;
    color: #cbcdd5;
  }
}
</style>
