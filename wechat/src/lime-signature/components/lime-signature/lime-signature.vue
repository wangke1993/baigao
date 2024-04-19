<template>
	<view class="signature" :class="{landscape}">
		<text class="signature-text">请在此处签名</text>
		<view class="signature-area" v-if="landscape">
			<l-signature disableScroll ref="signatureRef" :penColor="penColor" :penSize="penSize" :key="landscape" uid="0"
				:minLineWidth="2" :openSmooth="openSmooth" :boundingBox="bBox" landscape></l-signature>
		</view>
		<view class="signature-area" v-if="!landscape">
			<l-signature disableScroll ref="signatureRef" :penColor="penColor" :penSize="penSize" :key="!landscape" uid="1"
				:minLineWidth="2" :openSmooth="openSmooth" :boundingBox="bBox"></l-signature>
		</view>
		<view class="screen-handle" @click="change">
			<!-- #ifdef APP-NVUE -->
			<text>{{landscape ? '横':'竖'}}</text>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<image class="screen-handle__image" :src="icon" mode="widthFix"></image>
			<!-- #endif -->
		</view>
		<view class="tools">
			<view class="tools-item" @tap="isShowPen = !isShowPen;">
				<!-- #ifdef APP-NVUE -->
				<text>设置</text>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<image class="tools-item__image" src="https://fastly.jsdelivr.net/gh/liangei/image@latest/brush-fill.svg" mode="widthFix"></image>
				<!-- #endif -->
			</view>
			<view class="tools-item" @tap="onClick('undo')">
				<!-- #ifdef APP-NVUE -->
				<text>撤消</text>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<image class="tools-item__image" src="https://fastly.jsdelivr.net/gh/liangei/image@latest/reply-fill.svg" mode="widthFix"></image>
				<!-- #endif -->
			</view>
			<view class="tools-item restore" @tap="onClick('restore')">
				<!-- #ifdef APP-NVUE -->
				<text>上一步</text>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<image class="tools-item__image" src="https://fastly.jsdelivr.net/gh/liangei/image@latest/reply-fill.svg" mode="widthFix"></image>
				<!-- #endif -->
			</view>
			<view class="tools-item" @tap="onClick('clear')">
				<!-- #ifdef APP-NVUE -->
				<text>清空</text>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<image class="tools-item__image" src="https://fastly.jsdelivr.net/gh/liangei/image@latest/brush-2-fill.svg" mode="widthFix"></image>
				<!-- #endif -->
			</view>
			<view class="tools-item" @tap="onClick('save')">
				<!-- #ifdef APP-NVUE -->
				<text>保存</text>
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<image class="tools-item__image" src="https://fastly.jsdelivr.net/gh/liangei/image@latest/save-fill.svg" mode="widthFix"></image>
				<!-- #endif -->
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" @change="isShowPen = $event.show">
			<view class="popup-wrap">
				<view class="popup-item">
					<view class="popup-item__head">
						<view class="popup-item__title">笔锋</view>
						<view class="popup-item__more">
							<text class="popup-item__more-text">{{openSmooth}}</text>
							<switch class="popup-item__more-switch" @change="() => openSmooth = !openSmooth" :checked="openSmooth"/>
						</view>
					</view>
					<view class="popup-item__head">
						<view class="popup-item__title">包围盒</view>
						<view class="popup-item__more">
							<text class="popup-item__more-text">{{bBox}}</text>
							<switch class="popup-item__more-switch" @change="() => bBox = !bBox" :checked="bBox"/>
						</view>
					</view>
					<slider :value="penSize" max="20" @change="penSize = $event.detail.value" show-value/>
				</view>
			</view>
		</uni-popup>
		<!-- <view class="buttons">
			<button @click="onClick('clear')">清空</button>
			<button @click="onClick('undo')">撤销</button>
			<button @click="onClick('save')">保存</button>
			<button @click="bBox = !bBox">bBox{{bBox?'开':'关'}}</button>
			<button @click="onClick('openSmooth')">压感{{openSmooth?'开':'关'}}</button>
		</view> -->
		<!-- <view style="background-color: #2196f3; text-align: center;">
			<view style="border: 2px dashed #fff; display: inline-block;">
				<image :src="url" v-if="url" style="width: 370rpx;"  mode="widthFix"></image>
			</view>
		</view> -->
		<view class="signature-preview" v-if="url">
			<image class="signature-preview__image" :src="url" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				penColor: 'red',
				penSize: 16,
				url: '',
				show: false,
				landscape: false,
				openSmooth: true,
				bottomHeight: 0,
				bBox: true,
				isShowPen: false,
				customBar: this.CustomBar || 0,
			}
		},
		watch:{
			isShowPen(v) {
				if(!v) {
					this.$refs.popup.close()
				} else {
					this.$refs.popup.open()
				}
			}
		},
		computed: {
			// styles() {
			// 	if(this.landscape) {
			// 		return `width: 100vw; height: 100vh`
			// 	}
			// 	return `flex:1`
			// },
			icon() {
				if(this.landscape) {
					return `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00MSAxOUgyOVY3IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTE4IDZINlYxOCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zMCA0Mkg0MlYzMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik03IDI5SDE5VjQxIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTQyIDZMMjkgMTkiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMTkgMjlMNiA0MiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==`
				} 
				return `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik02IDZMMTYgMTUuODk5NSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik02IDQxLjg5OTVMMTYgMzIiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNNDIuMDAwMSA0MS44OTk1TDMyLjEwMDYgMzIiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNNDEuODk5NSA2TDMyIDE1Ljg5OTUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMzMgNkg0MlYxNSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik00MiAzM1Y0MkgzMyIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xNSA0Mkg2VjMzIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTYgMTVWNkgxNSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==`
			}
		},
		methods: {
			change() {
				this.landscape = !this.landscape; 
				this.url = ''
			},
			open() {
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open()
				this.show = true
			},
			onClick(type) {
				const {signatureRef} = this.$refs
				if (type == 'openSmooth') {
					this.openSmooth = !this.openSmooth
					return
				}
				if (type == 'save') {
					signatureRef.canvasToTempFilePath({
						quality: 0.8,
						success: (res) => {
							this.url = res.tempFilePath
						}
					})
					return
				}
				if (signatureRef)
					signatureRef[type]()
			}
		}
	}
</script>

<style lang="scss">
	.signature {
		/* #ifndef APP-NVUE */
		height: calc(100vh - var(--window-top));
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		&-area {
			/* #ifndef APP-NVUE */
			height: calc(100vh - var(--window-top) - 120rpx);
			/* #endif */
			/* #ifdef APP-NVUE */
			flex: 1;
			/* #endif */
		}
		&-text {
			position: absolute;
			/* #ifndef APP-NVUE */
			left: 50%;
			top: 50%;
			/* #endif */
			/* #ifdef APP-NVUE */
			left: 375rpx;
			top: 375rpx;
			/* #endif */
			font-size: 60rpx;
			color: #ddd;
			transform: translate(-50%,-50%);
			z-index: -1;
			transition: transform 300ms;
		}
		&-preview {
			position: absolute;
			bottom: 120rpx;
			right: 20rpx;
			width: 120px;
			box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.05);
			&__image {
				/* #ifndef APP-NVUE */
				width: 100%;
				/* #endif */
				/* #ifdef APP-NVUE */
				flex: 1;
				/* #endif */
			}
		}
		&.landscape {
			.signature-preview {
				bottom: 20rpx;
				width: 220px;
			}
			.signature-text {
				transform: translate(-50%,-50%) rotate(90deg);
			}
			.tools {
				z-index: 1;
				position: absolute;
				left: 10rpx;
				bottom: 10rpx;
				transform: rotate(90deg) translate(-100%, 0%);
				transform-origin: bottom left;
				padding: 0 16rpx;
				border-radius: 50rpx;
				&_item {
					padding: 0 16rpx;
				}
			}
			// .popup-wrap {
			// 	box-sizing: border-box;
			// 	height: 750rpx;
			// 	padding-top: 100px;
			// 	padding-bottom: 0;
			// 	transform: rotate(90deg) translate(-100%, 0%);
			// 	transform-origin: bottom left;
			// }
		}
	}
	
	.screen-handle {
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		width: 60rpx;
		height: 60rpx;
		background-color: white;
		border-radius: 10rpx;
		border: 1rpx solid #ddd;
		z-index: 10;
		justify-content: center;
		align-items: center;
		&__image {
			/* #ifndef APP-NVUE */
			width: 80%;
			/* #endif */
			/* #ifdef APP-NVUE */
			flex: 0.8;
			/* #endif */
		}
	}
	.tools {
	  background-color: #fff;
	  position: relative;
	  z-index: 999999;
	  display: flex;
	  height: 120rpx;
	  box-shadow: 0 -10rpx 30rpx rgba(0, 0, 0, 0.05);
	  /* #ifdef APP-NVUE */
	  flex-direction: row;
	  /* #endif */
	  /* #ifndef APP-NVUE */
	  padding-bottom: constant(safe-area-inset-bottom);
	  padding-bottom: env(safe-area-inset-bottom);
	  /* #endif */
	  &-item {
	    flex: 1;
		 /* #ifndef APP-NVUE */
	    display: flex;
		/* #endif */
	    align-items: center;
	    justify-content: center;
	    opacity: 0.6;
	    transition: opacity 0.1s ease-out;
	    &.restore{
			/* #ifndef APP-NVUE */
			transform: scaleX(-1);
			/* #endif */
		}
	    &.active {
	      opacity: 1;
	    }
	    
	    &__image {
	      width: 60rpx;
	    }
	  }
	}
	.popup {
	  &-wrap {
	    padding-bottom: 120rpx;
	    background-color: #fff;
	  }
	  
	  &-item {
	    padding-bottom: 30rpx;
	    
	    &__head {
	      display: flex;
		  flex-direction: row;
	      justify-content: space-between;
	      align-items: center;
	      padding: 30rpx;
	    }
	    
	    &__title {
	      font-size: 30rpx;
	    }
	    
	    &__more {
			flex-direction: row;
	      &-text {
	        font-size: 24rpx;
	        // padding-right 10rpx
	        color: #999;
			
	      }
	      
	      &-switch {
	        transform: scale(0.7);
	        transform-origin: center right;
	      }
	    }
	  }
	}
</style>