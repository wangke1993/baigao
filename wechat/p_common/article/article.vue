<template>
	<view class="page-view">
		<view class="content-box">
			<u-parse :content="content"></u-parse>
		</view>
	</view>
</template>

<script>
import { ArticleMangerControllerGetReleaseDetailByArticleId } from '@/api/ArticleMangerControllerApi.js';
import { BASE_URL } from '@/utils/request.js'
export default {
	data() {
		return {
			content: ''
		}
	},
	onLoad(query) {
		uni.setNavigationBarTitle({
			title: query.title,
			success: async () => {
				console.log('修改标题成功');
				// 获取会员拉新详情
				uni.showLoading({ title: '加载中' });
				let { data: res } = await ArticleMangerControllerGetReleaseDetailByArticleId(query.id);
				uni.hideLoading();
				if (res.status === 1) {
					let content = res.data.content;
					this.content = content.replaceAll('src="/api', `src="${BASE_URL}`).replaceAll('data-href="/api', `data-href="${BASE_URL}`);
					console.log('富文本', this.content)
				} else {
					uni.showToast({ title: res.message, icon: 'error' });
				}
			},
			fail: () => {
				console.log('修改标题失败');
			},
			complete: () => {
				console.log('修改标题结束');
			},
		})
	},
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>
.page-view {
	height: 100vh;
	.content-box {
		background: #fff;
		padding: 20rpx 10rpx;
		border-radius: 8rpx;
	}
}
</style>
