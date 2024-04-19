import { tabBarList } from "@/tabBarList.js";
export class userLoginOpenIdState {
  static key = "BG_WECHAT_LOGIN_USER_OPENID";
  static set(openId) {
    uni.setStorageSync(this.key, openId);
  }
  static get() {
    return uni.getStorageSync(this.key);
  }
  static remove() {
    return uni.removeStorageSync(this.key);
  }
}
export class userLoginLastTime {
  static key = "BG_WECHAT_LOGIN_LAST_TIME";
  static set() {
    const time = this.get();
    if (time) {
      // 第二次登录
      const timeQueue = JSON.parse(time);
      if (timeQueue.length >= 2) {
        timeQueue.pop();
      }
      timeQueue.unshift(new Date().toString());
      uni.setStorageSync(this.key, JSON.stringify(timeQueue));
    } else {
      // 第一次登录
      const timeQueue = [];
      timeQueue.push(new Date().toString());
      uni.setStorageSync(this.key, JSON.stringify(timeQueue));
    }
  }
  static getLast() {
    console.log("最后时间");
    let timeArr = this.get();
    if (timeArr) {
      timeArr = JSON.parse(timeArr);
      return timeArr[1];
    } else {
      return "";
    }
  }
  static get() {
    return uni.getStorageSync(this.key);
  }
  static remove() {
    return uni.removeStorageSync(this.key);
  }
}
export class UserPort {
  key = "BG_WECHAT_USER_PORT";
  constructor() {
    // uni.switchTab({ url: this.getIndex() });
  }
  getIndex() {
    return tabBarList[this.get()][0].pagePath;
  }
  toIndex() {
    const url = this.getIndex();
    uni.switchTab({ url });
  }
  set(userPort) {
    uni.setStorageSync(this.key, userPort);
  }
  get() {
    let value = uni.getStorageSync(this.key);
    if (!value) {
      /**
       * default: 用户端
       * manger: 客户经理端
       * servicePersonnel: 服务人员端
       */
      value = "default";
      this.set(value);
    }
    return value;
  }
  remove() {
    return uni.removeStorageSync(this.key);
  }
}
