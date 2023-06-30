<script>
	import {
		weChatLogin,
		weChatLoginRefresh
	} from '@/utils/authTools.js'
	import {
		saveToken,
		tokenIsOk
	} from '@/utils/authToken.js'

	export default {
		onLaunch: async function() {
			// #ifdef MP-WEIXIN
			console.log('App Launch');
			// uni.showLoading({
			// 	title: '加载中..'
			// })
			await weChatLogin();
			uni.hideLoading();
			// #endif
			// #ifdef H5
			if (tokenIsOk()) {
				await weChatLoginRefresh();
			}
			// #endif
			this.setAuthState();
		},
		onShow: async function() {
		},
		onHide: function() {
			console.log('App Hide');
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";

	/* #ifdef H5 */
	html,
	body {
		width: 100%;
		height: 100%;
	}

	.uni-app--showrightwindow .uni-page-head {
		display: none;
	}

	.uni-app--showrightwindow+.uni-tabbar-bottom {
		display: none;
	}

	/* #endif */
</style>