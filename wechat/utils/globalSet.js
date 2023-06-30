import Vue from 'vue'
import store from '@/store/index.js'
import {
	tokenIsOk,
	getUserInfoByStorage,
	setUserInfoByStorage
} from '@/utils/authToken.js'
import {
	MemberMangerControllerGetMemberWallet
} from '@/api/MemberMangerControllerApi.js'
import {
	SystemConfigControllerGetOpenAll
} from '@/api/SystemConfigControllerApi.js'

import authMixin from '@/utils/authMixin.js'
// 全局混入
Vue.mixin(authMixin);
// 全局方法
Vue.prototype.tokenIsOk = function() {
	return tokenIsOk();
};
Vue.prototype.getUserInfo = function() {
	return getUserInfoByStorage();
};
Vue.prototype.setUserInfo = function(userInfo) {
	return setUserInfoByStorage(userInfo);
};
Vue.prototype.login = function() {
	uni.navigateTo({
		url: '/pages/auth/login'
	})
};
Vue.prototype.setAuthState = function() {
	store.commit('setIsLogin');
	store.commit('setBindPhone');
	store.commit('setUserInfo');
}
Vue.prototype.getSystemConf = async function() {
	const {
		data
	} = await SystemConfigControllerGetOpenAll();
	if (data.status == 1) {
		store.commit('setSystemConf', data.data);
	} else {
		uni.showToast({
			title: data.message,
			icon: 'error'
		})
	}
}
Vue.prototype.guoqi = function (signUpTime) {
	return new Date(signUpTime) < new Date();
}