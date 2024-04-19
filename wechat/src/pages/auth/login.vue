<template>
  <view>
    <div class="login-box">
      <div class="login-form">
        <div class="logo">
          <div class="img-box">
            <image src="/static/logo.jpg" class="logo-img"></image>
          </div>
          <div class="title">柏高</div>
        </div>
        <div class="tips" v-if="!supplemented && isAgree">请您完善信息后登录</div>
        <div
          class="tips login-ok"
          v-else-if="!bindPhone && isAgree && (!needAuthorization || isAgree)"
        >
          绑定手机号，以接收柏高业务信息
        </div>
        <div class="tips login-ok" v-else-if="QRLoginKey">授权登录pc端</div>
        <div
          class="tips login-ok"
          v-else-if="supplemented && bindPhone && (!needAuthorization || isAgree)"
        >
          已登录并已绑定手机号
        </div>
        <div v-if="!supplemented && isAgree">
          <button
            class="avatar-wrapper"
            open-type="chooseAvatar"
            @chooseavatar="onChooseAvatar"
          >
            <image
              ref="awatarImage"
              class="avatar"
              :src="avatarUrl ? BASE_URL + avatarUrl : defaultAvatar"
            ></image>
          </button>
          <div class="avatar-tips" v-if="!avatarUrl">
            第一步：点击上方按钮选择头像
          </div>
          <input
            class="nickname"
            type="nickname"
            v-model="nickname"
            placeholder="请输入昵称"
          />
          <div
            style="margin-bottom: 68rpx"
            class="avatar-tips"
            v-if="!nickname"
          >
            第二步：点击上方输入框选择昵称
          </div>
        </div>
        <div
          class="agree-box"
          v-if="
            (!supplemented && !isAgree) || (supplemented && needAuthorization && !isAgree)
          "
        >
          <label class="radio">
            <span>
              同意
              <span class="agreement" @click="handleOpenPrivacyContract()">{{
                privacyContractName
              }}</span>
            </span>
          </label>
        </div>
        <button
          class="login-btn active"
          id="agree-btn"
          open-type="agreePrivacyAuthorization"
          @click="agree()"
          v-if="
            (!supplemented && !isAgree) || (supplemented && needAuthorization && !isAgree)
          "
        >
          同意
        </button>
        <button
          class="login-btn"
          v-if="!supplemented && isAgree"
          @click="authUserInfo"
          :class="{ active: isAgree }"
        >
          确认提交
        </button>
        <button
          class="login-btn active"
          v-else-if="!bindPhone && isAgree"
          open-type="getPhoneNumber"
          @getphonenumber="getphonenumber"
        >
          绑定手机号
        </button>
        <button
          class="login-btn active"
          v-else-if="QRLoginKey"
          @click="QRAuthorize"
        >
          授权登录
        </button>
        <button
          class="login-btn active"
          v-else-if="supplemented && (!needAuthorization || isAgree)"
          @click="back"
          :class="{ active: isAgree }"
        >
          返回
        </button>
      </div>
      <uni-popup ref="popup" :mask-click="false">
        <div class="get-phone-box">
          <div class="title">
            <text class="title">绑定手机号，以接收订单通知</text>
          </div>
          <div class="btn-box">
            <button class="close" style="border-radius: 0px" @click="close">
              取消
            </button>
            <button
              class="is-ok"
              style="border-radius: 0px"
              open-type="getPhoneNumber"
              @getphonenumber="getphonenumber"
              @click="close"
            >
              确定
            </button>
          </div>
        </div>
      </uni-popup>
    </div>
  </view>
</template>
<script>
import {
  registerMember,
  getPhoneNumber,
  weChatLogin,
} from "@/utils/authTools.js";
import { BASE_URL } from "../../utils/request";
import { WeChatApiControllerChangeQRStatusToSCAN } from "@/api/WeChatApiControllerApi.js";
import { AuthControllerQRAuthorize } from "@/api/AuthControllerApi.js";
export default {
  data() {
    return {
      isAgree: false,
      nickname: "",
      avatarUrl: "",
      QRLoginKey: "",
      privacyContractName: "",
      needAuthorization: false,
      defaultAvatar: "/static/background/default-user.png",
    };
  },
  computed: {
    /**
     * 信息已补全
     */
    supplemented() {
      return this.userInfo.userName;
    },
  },
  async onShow() {
    await weChatLogin();
  },
  mounted() {
    wx.getPrivacySetting({
      success: (res) => {
        // res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
        const { needAuthorization, privacyContractName } = res;
        if (needAuthorization) {
          // 需要弹出隐私协议
          this.privacyContractName = privacyContractName;
          this.needAuthorization = needAuthorization;
        } else {
          this.isAgree = true;
        }
      },
      fail: () => {},
      complete: () => {},
    });
  },
  onLoad(query) {
    console.log("加载登录页面-----", { query });
    const appConf = uni.getEnterOptionsSync();
    const QRCode = [1047, 1048, 1049, 1007, 1008, 1154, 1155];
    if (QRCode.includes(appConf?.scene) && query?.scene) {
      if (query.scene) {
        this.QRLoginKey = query.scene;
        // 更改扫码状态
        WeChatApiControllerChangeQRStatusToSCAN({
          loginKey: this.QRLoginKey,
        });
      }
    }
  },
  methods: {
    agree() {
      isAgree = true;
    },
    handleOpenPrivacyContract() {
      // 打开隐私协议页面
      wx.openPrivacyContract({
        success: () => {}, // 打开成功
        fail: () => {}, // 打开失败
        complete: () => {},
      });
    },
    async QRAuthorize() {
      const {
        data: { status, message },
      } = await AuthControllerQRAuthorize(this.QRLoginKey);
      if (status == 1) {
        // 跳转首页
        uni.switchTab({
          url: "/pages/Home",
        });
      } else {
        this.alertInfo(message);
      }
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail;
      const that = this;
      uni.uploadFile({
        url: `${BASE_URL}/file/upload`,
        files: [avatarUrl],
        filePath: avatarUrl,
        name: "file",
        success(res) {
          const { data } = res;
          const { data: fileInfo } = JSON.parse(data);
          that.avatarUrl = fileInfo.url;
        },
      });
    },
    close() {
      this.$refs.popup.close();
    },
    open() {
      this.$refs.popup.open();
    },
    back() {
      uni.navigateBack();
    },
    userAgreement() {
      uni.navigateTo({
        url: "/pages/auth/userAgreement",
      });
    },
    privacyAgreement() {
      uni.navigateTo({
        url: "/pages/auth/privacyAgreement",
      });
    },
    async getphonenumber(e) {
      if (e.detail.code) {
        uni.showLoading({
          title: "绑定中",
        });
        const res = await getPhoneNumber(e.detail.code);
        uni.hideLoading();
        console.log("获取手机号", res);
        if (res.status == 1) {
          uni.showToast({
            icon: "success",
            title: "绑定成功",
          });
          this.setAuthState();
          if (this.QRLoginKey) {
            this.QRAuthorize();
          } else {
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        }
      } else {
        uni.showToast({
          icon: "error",
          title: "绑定失败",
        });
      }
    },
    async authUserInfo() {
      if (this.avatarUrl == this.defaultAvatar) {
        uni.showToast({
          icon: "none",
          title: "请完善头像信息",
        });
        return;
      }
      console.log(this.nickname);
      if (!this.nickname) {
        uni.showToast({
          icon: "none",
          title: "请输入昵称",
        });
        return;
      }
      if (this.isAgree) {
        try {
          const res = await registerMember(this.avatarUrl, this.nickname);
          if (res.status == 1) {
            uni.showToast({
              icon: "success",
              title: "授权登录成功",
            });
            this.setAuthState();
            if (!this.bindPhone) {
              setTimeout(() => {
                this.$refs.popup.open();
              }, 1000);
            }
          } else {
            this.alertInfo(res.message);
          }
          console.log("授权登录成功", res);
        } catch (e) {
          console.log("授权登录失败", e);
          uni.showToast({
            icon: "error",
            title: "授权登录失败",
          });
        }
      } else {
        uni.showToast({
          icon: "none",
          title: "请勾选《用户协议》和《隐私协议》后再登录",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-box {
  height: 100vh;
  display: flex;
  justify-items: center;
  text-align: center;

  .avatar-wrapper {
    width: 100rpx;
    height: 100rpx;
    padding: 0;
    margin-bottom: 20rpx;

    .avatar {
      width: 100%;
      height: 100%;
    }
  }

  .get-phone-box {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;

    .title {
      padding: 20px;
    }

    .btn-box {
      display: flex;
      border-top: 1px solid #ccc;
      color: #333;

      .close {
        width: 50%;
        background-color: #fff;
      }

      .is-ok {
        width: 50%;
        background-color: #fff;
      }
    }
  }

  .login-form {
    width: 100%;
    margin-top: 10%;

    .logo-img {
      width: 188rpx;
      height: 188rpx;
    }
    .login-btn {
      background-color: #888;
      color: #fff;
      width: 200px;
      border-radius: 46px;
    }

    .active {
      background-color: #37aa83;
    }

    .agreement {
      color: #37aa83;
      font-weight: 700;
    }

    .agree-box {
      margin-bottom: 25px;
      font-size: 15px;
      color: #666;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 18px;
    }

    .tips {
      margin-top: 40px;
      margin-bottom: 15px;
      font-size: 16px;
      color: #000;
    }

    .avatar-tips {
      font-size: 28rpx;
      color: #666;
    }

    .login-ok {
      color: #333;
    }
    .nickname {
      width: 366rpx;
      height: 58rpx;
      margin: 0 auto;
      margin-top: 38rpx;
      margin-bottom: 30rpx;
      border-bottom: 1px solid #ccc;
      padding: 30rpx;
    }
    .logo {
      width: 100%;

      .img-box {
        height: 100px;
        width: 100px;
        border-radius: 50%;
        box-shadow: 0 0 6px #ccc;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      }

      .title {
        font-size: 22px;
        margin: 10px auto;
      }
    }
  }
}
</style>
