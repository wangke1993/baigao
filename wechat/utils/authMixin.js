import store from '@/store/index.js'
import {
	BASE_URL
} from '@/utils/request.js'
export default {
	data() {
		return {
			BASE_URL: BASE_URL
		}
	},
	computed: {
		isLogin() {
			return store.state.isLogin;
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
	}
}