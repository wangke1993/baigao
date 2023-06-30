<template>
	<view class="head-box">
		<div class="top">
			<div class="avater-box">
				<image class="avatar" :src="userInfo.avatar" mode="aspectFit"></image>
				{{userInfo.userName}}
			</div>
		</div>
		<div class="menu">
			<div class="item" @click="toPage('other')" :class="{active:menu=='other'}">更多功能1</div>
		</div>
	</view>
</template>
<script>
	import {
		userLoginLastTime
	} from '@/utils/state.js'
	export default {
		data() {
			return {
				menu: '',
			}
		},
		mounted() {
			this.toPage('other');
		},
		methods: {
			toPage(page) {
				this.menu = page;
				uni.$emit('toPage', {
					page
				})
			},
			clear() {
				this.menu = '';
			}
		}
	}
</script>
<style lang="scss" scoped>
	.head-box {
		width: 100%;
		height: 100%;
		padding: 18px 0;

		.top {
			display: flex;
			justify-content: flex-start;

			.avater-box {
				margin: 0 30px;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 50px;
				align-items: center;
				color: #555;

				.avatar {
					width: 40px;
					height: 40px;
					margin-right: 10px;
					border-radius: 40px;
				}
			}
		}

		.menu {
			display: flex;
			height: 100%;
			line-height: 40px;
			margin: 20px 30px;

			.item {
				min-width: 100px;
				padding: 0 18px;
				color: #666;
				text-align: center;

				&:hover {
					background-color: #37aa83;
					color: #fff;
					cursor: pointer;
				}

				&.active {
					background-color: #37aa83;
					color: #fff;
				}
			}


		}
	}
</style>