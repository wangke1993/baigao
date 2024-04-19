import store from "@/store/index.js";
import { BASE_URL } from "@/utils/request.js";
export default {
  data() {
    return {
      BASE_URL: BASE_URL,
    };
  },
  computed: {
    isLogin() {
      return store.state.isLogin;
    },
    userPort() {
      return store.state.userPort;
    },
    portList() {
      return store.state.portList;
    },
    bindPhone() {
      return store.state.bindPhone;
    },
    userInfo() {
      return store.state.userInfo;
    },
    systemConf() {
      return store.state.systemConf;
    },
  },
  methods: {
    age(birthday) {
      if (birthday) {
        const timeDiff = new Date() - new Date(birthday);
        return (timeDiff / (1000 * 60 * 60 * 24 * 365)).toFixed(0);
      } else {
        return "未知";
      }
    },
    money(n) {
      const num = Number(n);
      if (num) {
        return (num / 100).toFixed(2);
      } else {
        return 0;
      }
    },
  },
};
