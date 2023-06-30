<template>
	<view class="is-login" v-if="!isLogin">
		<view class="login-qr">
			<image :src="loginQr" style="width: 200px;height: 200px;"></image>
			<view class="txt">
				{{loginStatusText?loginStatusText:!loginQr?'登录码加载中...':'请扫码登录'}}
			</view>
		</view>
	</view>
	<view v-else>
		<top ref="top"></top>
		<view class="content" v-if="page">
			<view v-if="page=='other'" class="other">
				更多功能1
			</view>
		</view>
	</view>
</template>
<script>
	import {
		BASE_URL,
		uploadPrivate,
		getPrivate
	} from '../../utils/request.js'
	import {
		getToken,
		saveToken,
		tokenIsOk
	} from "@/utils/authToken.js"
	import {
		WeChatApiControllerCreateWeChatQR,
		WeChatApiControllerCreateLoginQRUrl,
		WeChatApiControllerCheckLoginQr
	} from '@/api/WeChatApiControllerApi.js'
	import {
		ArticleMangerControllerGetSignUpNotesPage
	} from '@/api/ArticleMangerControllerApi.js'
	import top from '@/pages/pc/top.vue'
	export default {
		components: {
			top,
		},
		data() {
			return {
				page: '',
				query: {},
				supplierQr: '',
				loginQr: '',
				loginQRKey: '',
				loginStatusText: '',
				loginTime: null,
				loginCheckTime: null,
				orderQr: '',
			}
		},
		created() {
			if (!this.isLogin && !tokenIsOk()) {
				this.getLoginQRUrl();
				this.loginTime = setInterval(() => {
					this.getLoginQRUrl();
				}, 15 * 60 * 1000);
				this.loginCheckTime = setInterval(() => {
					if (this.loginQRKey) {
						this.checkLoginQRStatus();
					}
				}, 1000);
			}
			uni.$on('toPage', ({page}) => {
				// TODO:在这里可以根据不同的page，自定义页面前置逻辑
				this.page = page;
			});
		},
		methods: {
			async getLoginQRUrl() {
				const sessionKey = 'LoginQRUrl';
				this.supplierQr = window.sessionStorage.getItem(sessionKey);
				if (!this.loginQr) {
					const {
						data: {
							data: {
								QR,
								key
							}
						}
					} = await WeChatApiControllerCreateLoginQRUrl({
						page: 'pages/auth/login'
					});
					this.loginQr = QR;
					this.loginQRKey = key;
				}
			},
			async checkLoginQRStatus() {
				const {
					data: {
						data: status
					}
				} = await WeChatApiControllerCheckLoginQr(this.loginQRKey);
				// '待扫码' : 'AWAIT',
				// '已扫码' : 'SCAN',
				// '已授权' : 'AUTHORIZE',
				// '已过期' : 'EXPIRE'
				if (status === 'SCAN') {
					this.loginStatusText = '已扫码，请在手机端授权登录';
				} else if (status.indexOf('AUTHORIZE') > -1) {
					clearInterval(this.loginCheckTime);
					clearInterval(this.loginTime);
					const [, token] = status.split(';');
					saveToken(token);
					this.setAuthState();
					window.location.reload();
				}
			},
			async getSupplierQr() {
				// 获取小程序码，可根据小程序码，跳转指定页面，传递指定参数
				const sessionKey = 'SupplierQr';
				this.supplierQr = window.sessionStorage.getItem(sessionKey);
				if (!this.supplierQr) {
					const {
						data: res
					} = await WeChatApiControllerCreateWeChatQR({
						page: 'p_personal/userInfo/edit',
						scene: '0'
					});
					this.supplierQr = res;
					window.sessionStorage.setItem(sessionKey, res);
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.no-data {
		width: 100%;
		text-align: center;
		height: 20rpx;
		color: #888;
		line-height: 20rpx;
	}

	.is-login {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;

		.login-qr {
			width: 208px;
			height: 208px;
			text-align: center;
			margin-bottom: 288px;

			.txt {
				margin-top: 18px;
				color: #666;
			}

		}
	}

	.content {
		margin: 10px 30px;
	}
</style>