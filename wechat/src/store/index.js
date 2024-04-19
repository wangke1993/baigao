import Vue from "vue";
import Vuex from "vuex";
import {
  tokenIsOk,
  phoneIsBind,
  getUserInfoByStorage,
} from "@/utils/authToken.js";
import { DC0004 } from "@/utils/enum.js";
import { UserPort } from "@/utils/state.js";
Vue.use(Vuex); //vue的插件机制
const userPort = new UserPort();

//Vuex.Store 构造器选项
const store = new Vuex.Store({
  state: {
    //存放状态
    isLogin: false,
    bindPhone: false,
    city: { UUID: "", name: "" },
    userInfo: {
      UUID: "",
      avatar: "",
      memberQR: "",
      openId: "",
      parentOpenId: "",
      phoneNumber: "",
      rank: "",
      rankName: "",
      userName: "",
      _id: "",
    },
    systemConf: {},
    /**
     * default: 用户端
     * manger: 客户经理端
     * servicePersonnel: 服务人员端
     */
    userPort: userPort.get(),
    portList: [],
    selected: userPort.getIndex(),
    /**
     * 是否扫码进入
     */
    scanCode: false,
  },
  mutations: {
    setCity(state, data) {
      state.city.name = data.name;
      state.city.UUID = data.UUID;
    },
    setSelected(state, selected) {
      state.selected = selected;
    },
    setPortList(state, portList) {
      state.portList = portList;
    },
    setScanCode(state, scanCode) {
      state.scanCode = scanCode;
      if (!scanCode) {
        userPort.toIndex();
      }
    },
    setUserPort(state, port) {
      state.userPort = port;
      userPort.set(port);
      state.selected = userPort.getIndex();
      if (!state.scanCode) {
        userPort.toIndex();
      }
    },
    setIsLogin(state) {
      console.log("设置登录状态");
      // 变更登录状态
      state.isLogin = tokenIsOk();
    },
    setBindPhone(state) {
      // 变更登录状态
      state.bindPhone = phoneIsBind();
    },
    setUserInfo(state) {
      // 变更登录状态
      const userInfo = getUserInfoByStorage();
      if (userInfo) {
        for (let k in userInfo) {
          state.userInfo[k] = userInfo[k];
        }
        state.userInfo.rankName = DC0004[state.userInfo.rank];
      }
    },
    setSystemConf(state, systemConfList) {
      systemConfList.forEach((conf) => {
        const jsonValue = JSON.parse(conf.confValue);
        if (jsonValue._id) {
          state.systemConf[conf.confSelect] = jsonValue;
        } else {
          state.systemConf[conf.confSelect] = Number(conf.confValue);
        }
      });
      console.log(
        "----------------------------系统参数配置----------------------\n",
        state.systemConf
      );
    },
  },
});
export default store;
