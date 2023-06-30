<template>
	<view>
		<view>
			<!-- 轮播图 -->
			<view class="uni-margin-wrap">
				<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay"
					:interval="interval" :duration="duration">
					<swiper-item v-for="item in adList" @click="showDetail(item)" :key="item._id">
						<view class="swiper-item">
							<image class="img" :src="BASE_URL+item.photo"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		AdMangerControllerGetList
	} from '@/api/AdMangerControllerApi.js'
	import {
		toLoginPage,
		weChatLoginRefresh
	} from '@/utils/authTools.js'
	export default {
		data: () => {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				adList: [],
				notice: [],
				noticeData: [],
				biddingManger: [],
				noticeManger: [],
				biddingTotal: 0,
				noticeTotal: 0,
				keyWord: '',
			}
		},
		watch: {
			keyWord: function() {
				this.getBiddingPage(5, 1);
			}
		},
		async onShow() {
			uni.showLoading({
				title: '加载中...'
			})
			if (this.isLogin) {
				await weChatLoginRefresh();
				this.setAuthState();
			}
			this.getAdList();
			uni.hideLoading();
		},
		methods: {
			toLoginPage() {
				toLoginPage();
			},
			async getAdList() {
				const {
					data: res
				} = await AdMangerControllerGetList();
				const {
					status,
					data
				} = res;
				if (status == 1) {
					this.adList = data;
					console.log(this.adList);
				}
			},
			showDetail(item) {
				// #ifdef H5
				uni.$emit('toPage', {
					page: 'NoticeDetail',
					query: {
						id: item.linkValue,
						title: item.name,
						isNotice: false
					},
				})
				// #endif
				// #ifdef MP-WEIXIN
				console.log('点击', item)
				uni.navigateTo({
					url: `/p_home/detail/index?id=${item.linkValue}&title=${item.name}`,
				})
				// #endif
			}
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

	/* #ifdef MP-WEIXIN */
	.uni-margin-wrap {
		width: 100%;
	}

	.swiper {
		height: 380rpx;
		width: 750rpx;
	}

	/* #endif */
	/* #ifdef H5 */
	.uni-margin-wrap {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 18px;
	}

	.swiper {
		height: 200px;
		width: 430px;
	}

	/* #endif */


	.swiper-item {
		display: block;
		height: 380rpx;
		width: 750rpx;
		text-align: center;

		.img {
			width: 100%;
		}
	}

	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}


	.title-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		justify-items: center;
		color: #333;
		margin: 20px 0;

		.title {
			font-size: 1.2rem;
			font-weight: 600;
			padding-left: 28rpx;
			position: relative;
		}

		.title::before {
			content: '';
			width: 18rpx;
			height: 100%;
			background-color: #37aa83;
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 18rpx;
		}

		.title-more {
			display: flex;

			.more {
				margin-right: 10rpx;
				color: #000;
			}
		}
	}

	.not-login {
		padding: 40px 0;
		text-align: center;
		color: #888;
	}

	.bottom-box {
		padding: 0 20rpx;
		/* #ifdef H5 */
		padding: 0px 18px;
		/* #endif */

		.notice-box {
			margin: 30rpx 0;
			position: relative;

			.notice-list {
				border-radius: 8rpx;
				overflow: hidden;

				::v-deep .u-notice-bar {
					padding: 8px 12px !important;
				}
			}

			.notice-more {
				position: absolute;
				width: 88rpx;
				height: 100%;
				right: 0;
				top: 0;
				display: flex;
				justify-content: flex-end;
				padding-right: 20rpx;
				background-color: #37aa83;
				border-radius: 8rpx;
			}
		}
	}

	/* #ifdef H5*/
	::v-deep .page--active {
		background-color: #37aa83 !important;
	}

	.list {
		padding-bottom: 20px;

		.list-item {
			display: flex;
			height: 88px;
			overflow: hidden;
			box-shadow: 0 0 6px #ccc;
			margin-bottom: 10px;
			box-sizing: border-box;

			.left {
				width: 78%;
				overflow: hidden;
				padding: 5px 12px;

				.title {
					font-weight: 600;
					margin-bottom: 6px;
				}

				.sync {
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-bottom: 6px;
					color: #888;
				}

				.open-time {
					color: #888;
				}
			}

			.right {
				width: 22%;
				background-color: #37aa83;
				color: #fff;
				text-align: center;
				line-height: 88px;
				cursor: pointer;
			}
		}
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.list {
		padding-bottom: 20rpx;

		.list-item {
			display: flex;
			height: 168rpx;
			border-radius: 18rpx;
			overflow: hidden;
			box-shadow: 0 0 6rpx #ccc;
			margin-bottom: 25rpx;

			.left {
				width: 78%;
				overflow: hidden;
				box-sizing: border-box;
				padding: 20rpx;

				.title {
					font-weight: 600;
					margin-bottom: 10rpx;
				}

				.sync {
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-bottom: 8rpx;
					color: #888;
				}

				.open-time {
					color: #888;
				}
			}

			.right {
				width: 22%;
				background-color: #37aa83;
				color: #fff;
				text-align: center;
				line-height: 168rpx;
			}
		}
	}

	/* #endif */
</style>