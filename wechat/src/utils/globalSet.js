import Vue from "vue";
import store from "@/store/index.js";
import {
  tokenIsOk,
  getUserInfoByStorage,
  setUserInfoByStorage,
} from "@/utils/authToken.js";
import { toLoginPage, getPhoneNumber } from "@/utils/authTools.js";
// import { SystemConfigControllerGetOpenAll } from "@/api/SystemConfigControllerApi.js";
// import { EmployeeManagementControllerGetMembershipPositions } from "../api/EmployeeManagementControllerApi";
import { SystemConfigControllerGetSystemConfigDetail } from "../api/SystemConfigControllerApi";
import { formatDate } from "utils/commonTools";

import authMixin from "@/utils/authMixin.js";
// 全局混入
Vue.mixin(authMixin);

// 全局方法
Vue.prototype.alertInfo = function (msg) {
  uni.$u.toast(msg);
};
(Vue.prototype.formatDate = function (d, str) {
  return formatDate(d, str);
}),
  (Vue.prototype.tokenIsOk = function () {
    return tokenIsOk();
  });
Vue.prototype.getUserInfo = function () {
  return getUserInfoByStorage();
};
Vue.prototype.setUserInfo = function (userInfo) {
  return setUserInfoByStorage(userInfo);
};
Vue.prototype.setCity = function (UUID, name) {
  return store.commit("setCity", { UUID, name });
};
Vue.prototype.login = function () {
  toLoginPage();
};
Vue.prototype.toArticle = function (id, title = "") {
  if (!id) {
    return;
  }
  uni.navigateTo({
    url: `/subCommonPages/article/article?id=${id}&title=${title}`,
  });
};
/**
 * 获取系统配置参数,多个code用逗号隔开
 * @param {*} code
 * @returns
 */
Vue.prototype.getSystemConfValue = async function (code) {
  if (!code) {
    return;
  }
  const {
    data: { status, data, message },
  } = await SystemConfigControllerGetSystemConfigDetail(code);
  if (status === 1) {
    const conf = {};
    if (data.length > 0) {
      data.map((item) => {
        conf[item.confSelect] = item.confValue;
      });
    }
    return conf;
  } else {
    this.alertInfo(`获取系统配置：${message}`);
  }
};
Vue.prototype.toPage = function (url) {
  console.log(url);
  if (!url) {
    return;
  }
  uni.navigateTo({
    url,
  });
};
Vue.prototype.setAuthState = function () {
  store.commit("setIsLogin");
  store.commit("setBindPhone");
  store.commit("setUserInfo");
  this.InitUserPort();
};
Vue.prototype.setUserPort = function (userPort) {
  /**
   * default: 用户端
   * manger: 客户经理端
   * servicePersonnel: 服务人员端
   */
  store.commit("setUserPort", userPort);
};

Vue.prototype.setScanCode = function (scanCode) {
  /**
   * 是否扫码进入
   */
  store.commit("setScanCode", scanCode);
};

Vue.prototype.InitUserPort = async function () {
  /**
   * 检查用户是否有权呆在当前角色端
   */
  console.log("登录状态", store.state.isLogin);
  this.setUserPort("default");
};
Vue.prototype.CheckUserPort = async function () {
  /**
   * 检查用户是否有权呆在当前角色端
   */
  if (store.state.userPort !== "default") {
    await this.InitUserPort();
  }
};
Vue.prototype.switchTab = function (url) {
  store.commit("setSelected", url);
  uni.switchTab({ url });
};
// Vue.prototype.getSystemConf = async function () {
//   const { data } = await SystemConfigControllerGetOpenAll();
//   if (data.status == 1) {
//     store.commit("setSystemConf", data.data);
//   } else {
//     uni.showToast({
//       title: data.message,
//       icon: "error",
//     });
//   }
// };
Vue.prototype.getUserPhoneNumber = async function (e) {
  if (e.detail.code) {
    uni.showLoading({
      title: "获取中",
    });
    const res = await getPhoneNumber(e.detail.code);
    uni.hideLoading();
    if (res.status == 1) {
      store.commit("setBindPhone");
      store.commit("setUserInfo");
      uni.showToast({
        icon: "success",
        title: "获取成功",
      });
    }
  } else {
    uni.showToast({
      icon: "error",
      title: "获取失败",
    });
  }
};
// 判断当前sdk版本号是否大于指定版本号
Vue.prototype.CheckSdkVersion = function (v2) {
  // 本方法最低要求版本库2.21.4
  let v1 = wx.getAppBaseInfo().SDKVersion;
  console.log("当前版本------------", v1);
  v1 = v1.split(".");
  v2 = v2.split(".");
  // 同步版本号长度
  const len = Math.max(v1.length, v2.length);
  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }
  // 对比版本号
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);
    if (num1 < num2) {
      return false;
    }
  }
  return true;
};
