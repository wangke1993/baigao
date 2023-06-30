<template>
	<view>
		<div class='login-box'>
			<div class="login-form">
				<div class='logo'>
					<div class='img-box'>
						<image src="../../static/logo.png" style="width: 100px;height: 100px;" mode=""></image>
					</div>
					<div class='title'>小程序标题</div>
				</div>
				<div class='tips' v-if="!isLogin">请您完善信息后登录</div>
				<div class='tips login-ok' v-else-if="!bindPhone">绑定手机号，以接收招标信息</div>
				<div class='tips login-ok' v-else-if="QRLoginKey">授权登录pc端</div>
				<div class='tips login-ok' v-else>已登录并已绑定手机号</div>
				<div v-if="!isLogin">
					<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
						<image ref="awatarImage" class="avatar" :src="avatarUrl"></image>
					</button>
					<input type="nickname" style="margin-bottom: 30rpx;" v-model="nickname" placeholder="请输入昵称,必填">
				</div>
				<div class='agree-box' v-if="!isLogin" @click="isAgree=!isAgree">
					<label class="radio">
						<radio value="agree" style="transform:scale(0.7);vertical-align: ;" :checked="isAgree" />
						<span>登录即同意 <span class='agreement' @click='userAgreement'>《用户协议》</span>和 <span
								class='agreement' @click='privacyAgreement'>《隐私政策》</span></span>
					</label>
				</div>
				<button class="login-btn" v-if="!isLogin" @click="authUserInfo" :class="{active:isAgree}">立即登录</button>
				<button class="login-btn active" v-else-if="!bindPhone" open-type='getPhoneNumber'
					@getphonenumber="getphonenumber">绑定手机号</button>
				<button class="login-btn active" v-else-if="QRLoginKey" @click="QRAuthorize">授权登录</button>
				<button class="login-btn active" v-else @click="back" :class="{active:isAgree}">返回</button>
			</div>
			<uni-popup ref="popup" :mask-click="false">
				<div class='get-phone-box'>
					<div class='title'>
						<text class="title">绑定手机号，以接收招标信息</text>
					</div>
					<div class='btn-box'>
						<button class="close" style="border-radius: 0px" @click="close">取消</button>
						<button class="is-ok" style="border-radius: 0px" open-type='getPhoneNumber'
							@getphonenumber="getphonenumber" @click="close">确定</button>
					</div>
				</div>
			</uni-popup>
		</div>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>
<script>
	const defaultAvatar =
		'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
	import {
		registerMember,
		getPhoneNumber,
		weChatLogin
	} from '@/utils/authTools.js';
	import {
		BASE_URL
	} from '../../utils/request';
	import {
		WeChatApiControllerChangeQRStatusToSCAN
	} from '@/api/WeChatApiControllerApi.js'
	import {
		AuthControllerQRAuthorize
	} from '@/api/AuthControllerApi.js'
	export default {
		data() {
			return {
				isAgree: false,
				nickname: '',
				avatarUrl: defaultAvatar,
				QRLoginKey: '',
			}
		},
		async onShow() {
			await weChatLogin();
		},
		mounted() {},
		onLoad(query) {
			const appConf = uni.getEnterOptionsSync();
			const QRCode = [1047, 1048, 1049, 1007, 1008, 1154, 1155];
			if (QRCode.includes(appConf?.scene) && query?.scene) {
				if (query.scene) {
					this.QRLoginKey = query.scene;
					// 更改扫码状态
					WeChatApiControllerChangeQRStatusToSCAN({
						loginKey: this.QRLoginKey
					});
				}
			}
		},
		methods: {
			async QRAuthorize() {
				const {
					data: {
						status,
						message
					}
				} = await AuthControllerQRAuthorize(this.QRLoginKey);
				if (status == 1) {
					// 跳转首页
					uni.switchTab({
						url: '/pages/home/index'
					});
				} else {
					uni.$u.toast(message);
				}
			},
			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail
				const that = this;
				uni.uploadFile({
					url: `${BASE_URL}/file/upload`,
					files: [avatarUrl],
					filePath: avatarUrl,
					name: 'file',
					success(res) {
						const {
							data
						} = res;
						const {
							data: fileInfo
						} = JSON.parse(data);
						that.avatarUrl = BASE_URL + fileInfo.url;
					}
				})
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
					url: '/pages/auth/userAgreement'
				})
			},
			privacyAgreement() {
				uni.navigateTo({
					url: '/pages/auth/privacyAgreement'
				})
			},
			async getphonenumber(e) {
				if (e.detail.code) {
					uni.showLoading({
						title: '绑定中'
					})
					const res = await getPhoneNumber(e.detail.code);
					uni.hideLoading();
					console.log('获取手机号', res);
					if (res.status == 1) {
						uni.showToast({
							icon: 'success',
							title: '绑定成功'
						})
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
						icon: 'error',
						title: '绑定失败'
					})
				}
			},
			async authUserInfo() {
				if (this.avatarUrl == defaultAvatar) {
					uni.showToast({
						icon: 'none',
						title: '请完善头像信息'
					})
					return;
				}
				console.log(this.nickname)
				if (!this.nickname) {
					uni.showToast({
						icon: 'none',
						title: '请输入昵称'
					})
					return;
				}
				if (this.isAgree) {
					try {
						const res = await registerMember(this.avatarUrl, this.nickname);
						if (res.status == 1) {
							uni.showToast({
								icon: 'success',
								title: '授权登录成功'
							})
							this.setAuthState();
							if (!this.bindPhone) {
								setTimeout(() => {
									this.$refs.popup.open();
								}, 1500);
							}
						} else {
							let params = {
								type: 'error',
								title: '错误提示',
								message: res.message,
								duration: 5000
							}
							this.$refs.uToast.show({
								...params,
								complete() {}
							});
						}
						console.log('授权登录成功', res);
					} catch (e) {
						console.log('授权登录失败', e);
						uni.showToast({
							icon: 'error',
							title: '授权登录失败'
						})
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '请勾选《用户协议》和《隐私协议》后再登录'
					})
				}
			}
		}
	}
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
			}

			.tips {
				margin-top: 40px;
				margin-bottom: 15px;
				font-size: 16px;
				color: #000;
			}

			.login-ok {
				color: #333;
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