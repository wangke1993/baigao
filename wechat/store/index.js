import Vue from 'vue'
import Vuex from 'vuex'
import {
	tokenIsOk,
	phoneIsBind,
	getUserInfoByStorage,
} from '@/utils/authToken.js'
import {
	DC0008
} from '@/utils/enum.js'
Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: { //存放状态
		isLogin: false,
		bindPhone: false,
		userInfo: {
			UUID: "",
			avatar: "",
			memberQR: "",
			openId: "",
			parentOpenId: "",
			phoneNumber: "",
			rank: "",
			rankName: '',
			userName: "",
			_id: "",
		},
		systemConf: {},
	},
	mutations: {
		setShop(state, shop) {
			if (shop) {
				for (let k in shop) {
					state.shop[k] = shop[k]
				}
			}
		},
		setIsLogin(state) {
			console.log('设置登录状态')
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
					state.userInfo[k] = userInfo[k]
				}
				state.userInfo.rankName = DC0008[state.userInfo.rank];
			}
		},
		setSystemConf(state, systemConfList) {
			systemConfList.forEach(conf => {
				const jsonValue = JSON.parse(conf.confValue);
				if (jsonValue._id) {
					state.systemConf[conf.confSelect] = jsonValue;
				} else {
					state.systemConf[conf.confSelect] = Number(conf.confValue);
				}
			});
			console.log('----------------------------系统参数配置----------------------\n', state.systemConf);
		},
	}
})
export default store