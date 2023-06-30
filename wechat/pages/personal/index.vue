<template>
	<view>
		<image class="box-bg" src="../../static/personal-bg.png"></image>
		<view class="content-box">
			<view class="user-info-box">
				<view class="left">
					<div class="avater-box">
						<image class="avatar" :src="userInfo.avatar" mode="aspectFit"></image>
					</div>
				</view>
				<view class="right" v-if="isLogin">
					<view class="top">
						<view class="name">
							{{userInfo.userName}}
						</view>
					</view>
					<view class="center">
						{{userInfo.rankName}}
					</view>
					<view class="bottom">
						上次访问时间：<uni-dateformat format='yyyy/MM/dd hh:mm:ss' :date="lastTime"></uni-dateformat>
					</view>
				</view>
				<view class="right not-login" @click="toLoginPage()" v-else>
					点我登录
				</view>
			</view>
			<view class="other-box">
				<view class="not-login-box" v-if='!isLogin'>
					登录后使用
				</view>
				<view class="top">
					<view class="title">
						更多功能
					</view>
				</view>
				<view class="bottom">
					<view class="item" @click="toOther()">
						<view class="icon-and-name">
							<image class="img" src="../../static/images/icon/other-menu/favorite.png" mode="aspectFit">
							</image>
							<text class="name">更多功能1</text>
						</view>
						<u-icon name="arrow-right" :size='22'></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>
<script>
	import {
		userLoginLastTime
	} from '@/utils/state.js'
	import {
		toLoginPage,
		weChatLoginRefresh
	} from '@/utils/authTools.js'
	export default {
		data: () => {
			return {
				lastTime: userLoginLastTime.getLast(),
			}
		},
		async onShow() {
			// console.log('最后登录时间', userLoginLastTime.getLast())
			uni.showLoading({
				title:'加载中...'
			})
			await weChatLoginRefresh();
			this.setAuthState();
			uni.hideLoading();
		},
		mounted() {},
		methods: {
			toLoginPage() {
				toLoginPage();
			},
			toOther(){
				uni.navigateTo({
					url: '/p_personal/other_menu/other',
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.box-bg {
		width: 750rpx;
		height: 1049rpx;
	}

	.content-box {
		position: absolute;
		top: 0;
		width: 750rpx;
		box-sizing: border-box;
		padding: 25rpx;

		.user-info-box {
			display: flex;
			margin-top: 100rpx;

			.left {
				width: 220rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.avater-box {
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					overflow: hidden;
					box-sizing: border-box;
					border: 10rpx #fff solid;
					box-shadow: 0 0 8rpx #888;

					.avatar {
						width: 168rpx;
						height: 168rpx;
					}
				}
			}

			.not-login {
				height: 168rpx;
				font-weight: 700;
				color: #888;
				line-height: 168rpx;
			}

			.right {
				width: 520rpx;
				padding-left: 15rpx;

				.top {
					display: flex;
					justify-content: space-between;
					margin: 15rpx 0;

					.name {
						font-weight: 600;
						font-size: 1.1rem;
					}

					.edit {
						display: flex;
						margin-right: 20rpx;
						color: #666;
					}
				}

				.center {
					font-size: .9rem;
					color: #666;
					margin: 10rpx 0;
					font-weight: 600;
				}

				.bottom {
					font-size: .9rem;
					margin: 15rpx 0;
					font-weight: 600;
					color: #666;
				}
			}
		}

		.not-login-box {
			top: 0;
			left: 0;
			position: absolute;
			width: 100%;
			height: 100%;
			background-color:rgba(0, 0, 0, .6) ;
			border-radius: 20rpx;
			line-height: 300rpx;
			text-align: center;
			color: #ccc;
		}

		.order-box {
			width: 100%;
			height: 300rpx;
			background-color: #fff;
			box-shadow: 0 4rpx 12rpx #888;
			border-radius: 20rpx;
			margin-top: 68rpx;
			box-sizing: border-box;
			padding: 30rpx 40rpx;
			position: relative;

			.top {
				display: flex;
				justify-content: space-between;

				.title {
					font-size: 1.2rem;
					font-weight: 600;
				}
			}

			.bottom {
				display: flex;
				justify-content: space-between;
				margin-top: 40rpx;

				.item {
					display: flex;
					flex-direction: column;
					padding: 0 20rpx;

					.icon {
						width: 90rpx;
						height: 100rpx;
					}

					.text {
						text-align: center;
					}
				}
			}
		}

		.other-box {
			width: 100%;
			background-color: #fff;
			box-shadow: 0 4rpx 12rpx #888;
			border-radius: 20rpx;
			margin-top: 28rpx;
			box-sizing: border-box;
			padding: 40rpx;
			position: relative;

			.top {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.title {
					font-size: 1.2rem;
					font-weight: 600;
				}

			}

			.bottom {
				margin-top: 40rpx;

				.item {
					display: flex;
					justify-content: space-between;

					.icon-and-name {
						display: flex;
						padding: 18rpx 0;

						.img {
							width: 50rpx;
							height: 50rpx;
							margin-right: 18rpx;
						}

						.name {
							line-height: 50rpx;
						}
					}
				}
			}
		}
	}
</style>