<template>
	<view class="page-view" v-if="detail._id">
		<!-- #ifdef MP-WEIXIN -->
		<view class="content-box">
			<u-parse :content="content"></u-parse>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="content-box" v-html='content'>
		</view>
		<!-- #endif -->
	</view>
	<view v-else>
		加载中...
	</view>
</template>

<script>
	import {
		ArticleMangerControllerGetReleaseDetailByArticleId
	} from '@/api/ArticleMangerControllerApi.js';
	import {
		BiddingMangerControllerAddBiddingSingUp,
	} from '@/api/BiddingMangerControllerApi.js';
	import {
		BASE_URL
	} from '@/utils/request.js'
	export default {
		props: {
			query: {
				isNotice: Boolean,
				title: String,
				id: String
			}
		},
		data() {
			return {
				content: '',
				isNotice: false,
				detail: {},
			}
		},
		mounted() {
			// #ifdef H5
			console.log(this.query);
			if (this.query.isNotice) {
				this.isNotice = this.query.isNotice;
			} else {
				this.isNotice = false;
			}
			uni.setNavigationBarTitle({
				title: this.query.title,
				success: async () => {
					uni.showLoading({
						title: '加载中'
					});
					this.getDetail(this.query.id);
				}
			})
			// #endif

		},
		onLoad(query) {
			// #ifdef MP-WEIXIN
			if (query.isNotice) {
				this.isNotice = query.isNotice;
			} else {
				this.isNotice = false;
			}
			uni.setNavigationBarTitle({
				title: query.title,
				success: async () => {
					uni.showLoading({
						title: '加载中'
					});
					this.getDetail(query.id);
				}
			})
			// #endif
		},
		methods: {
			async getDetail(id) {
				let {
					data: res
				} = await ArticleMangerControllerGetReleaseDetailByArticleId(id);
				uni.hideLoading();
				if (res.status === 1) {
					let content = res.data.content;
					for (let i in 100) {
						content += content + ';'
					}
					this.content = content.replaceAll('src="/api', `src="${BASE_URL}`).replaceAll(
						'data-href="/api', `data-href="${BASE_URL}`);
					this.detail = res.data;
					if (!this.detail.signUpUsers) {
						this.detail.signUpUsers = [];
					}
				} else {
					uni.showToast({
						title: res.message,
						icon: 'error'
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-view {
		height: 100vh;
		background: #fff !important;

		.content-box {
			padding: 20rpx 10rpx;
			border-radius: 8rpx;
		}

		.signUp-btn {
			background-color: #37aa83;
		}

		.signUped-btn {
			background-color: #CCC;
			color: #666;
		}

		/* #ifdef H5 */
		.signUp-btn {
			width: 300px;
			position: absolute;
			cursor: pointer;
		}

		.signUped-btn {
			width: 300px;
			position: absolute;
		}

		/* #endif */
	}
</style>