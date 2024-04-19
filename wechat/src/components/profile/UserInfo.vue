<template>
  <div class="box">
    <div class="left">
      <div class="avatar">
        <img :src="avatar" />
      </div>
      <div class="info-box">
        <div class="workState" v-if="userPort == 'servicePersonnel'">
          <DrawSelect
            v-if="selectShow"
            :labelKey="selectConf.labelKey"
            :valueKey="selectConf.valueKey"
            :title="selectConf.title"
            :list="selectConf.list"
            :text="selectConf.text"
            v-model="selectConf.value"
            @change="change"
          />
        </div>
        <div class="userName">
          {{ userName }}
        </div>
        <div v-if="userName" class="vipBox">
          <img src="/static/icon/vip-icon.png" />
          <div class="vipName">{{ vipName }}</div>
        </div>
        <div @click="login" v-else class="userName">点我补全信息</div>
      </div>
    </div>
    <div class="qr">
      <img src="/static/icon/qr.png" />
    </div>
  </div>
</template>
<script>
import DrawSelect from "../DrawSelect.vue";
import { BASE_URL } from "../../utils/request";
export default {
  components: {
    DrawSelect,
  },
  data() {
    return {
      userName: "",
      avatar: "",
      vipName: "普通会员",
      selectShow: true,
      selectConf: {
        value: "",
        text: "",
        title: "选择工作状态",
        labelKey: "text",
        valueKey: "status",
        list: [
          { text: "正常", status: "0" },
          { text: "上岗", status: "1" },
          { text: "休息", status: "2" },
        ],
      },
    };
  },
  created() {
    // this.init();
  },
  methods: {
    change(value) {},
    async init() {
      if (this.userPort == "default") {
        this.userName = this.userInfo.userName;
        this.avatar = BASE_URL + this.userInfo.avatar;
        this.vipName = "普通会员";
      } else {
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  padding: 168rpx 40rpx 40rpx;
  .workState {
    color: blue;
    font-weight: 700;
    font-size: 26rpx;
  }
  .left {
    display: flex;
    justify-items: center;
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      overflow: hidden;
      border: 2rpx solid #ccc;
      img {
        width: 120rpx;
        height: 120rpx;
      }
    }
    .info-box {
      margin-left: 28rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .userName {
        font-size: 36rpx;
        font-weight: 700;
        margin-bottom: 12rpx;
      }
      .vipBox {
        position: relative;
        img {
          height: 60rpx;
          width: 66.67rpx;
          position: absolute;
          left: -16rpx;
          top: -10rpx;
        }
        .vipName {
          background-image: url("/static/background/vip-bg.png");
          background-size: 160rpx 42rpx;
          background-repeat: no-repeat;
          font-size: 24rpx;
          height: 42rpx;
          width: 160rpx;
          text-align: center;
          line-height: 42rpx;
          color: #5f3218;
          margin-left: 18rpx;
          padding-left: 10rpx;
          font-weight: 700;
        }
      }
    }
  }
  .qr {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    img {
      width: 36rpx;
      height: 36rpx;
    }
  }
}
</style>
