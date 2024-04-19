# signature 写字板
> uniapp 写字板，可用业务签名等场景  
> [查看更多 站点1](https://limeui.qcoon.cn/#/signature) <br> 
> [查看更多 站点2](http://liangei.gitee.io/limeui/#/signature)  
> Q群：1169785031


## 平台兼容

| H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 小程序 | App |
| --- | ---------- | ------------ | ---------- | ---------- | --------- | --- |
| √   | √          | √         | 未测       | 未测          | 未测      | √    |


## 代码演示

### 基本用法
```html
<view style="width: 750rpx ;height: 750rpx;">
	<l-signature disableScroll  ref="signatureRef" :penColor="penColor" :penSize="penSize" :openSmooth="openSmooth" ></l-signature>
</view>
<view>
	<button @click="onClick('clear')">清空</button>
	<button @click="onClick('undo')">撤消</button>
	<button @click="onClick('save')">保存</button>
	<button @click="onClick('openSmooth')">压感{{openSmooth?'开':'关'}}</button>
</view>
```

```js
export default {
	data() {
		return {
			title: 'Hello',
			penColor: 'red',
			penSize: 5,
			url: '',
			openSmooth: true
		}
	},
	methods: {
		onClick(type) {
			 if(type == 'openSmooth') {
				 this.openSmooth = !this.openSmooth
				 return
			 }
			if (type == 'save') {
				this.$refs.signatureRef.canvasToTempFilePath({
					success: (res) => {
						// 是否为空画板 无签名
						console.log(res.isEmpty)
						// 生成图片的临时路径
						// H5 生成的是base64
						this.url = res.tempFilePath
					}
				})
				return
			}
			if (this.$refs.signatureRef)
				this.$refs.signatureRef[type]()
		}
	}
}

```

### 横屏
通过设置`landscape`,改变生成图片的方向，达到横屏的作用
```html
<view style="width: 100vw; height: 100vh;">
	<l-signature landscape></l-signature>
</view>
<view style="transform: rotate(90deg);">
	<button @click="onClick('clear')">清空</button>
	<button @click="onClick('undo')">撤消</button>
	<button @click="onClick('save')">保存</button>
	<button @click="onClick('openSmooth')">压感{{openSmooth?'开':'关'}}</button>
</view>
```

### 插件标签
- 默认 l-signature 为 component
- 默认 lime-signature 为 demo



## API
### Props

| 参数             | 说明                  | 类型              | 默认值        |
| --------------   | ------------         | ----------------  | ------------ |
| penSize          | 画笔大小              | <em>number</em>   |    `2`           |
| minLineWidth     | 线条最小宽            | <em>number</em>    | `2`        |
| maxLineWidth     | 线条最大宽            | <em>number</em>    | `6`        |
| penColor         | 画笔颜色              | <em>string</em>    | `black`      |
| backgroundColor  | 背景颜色(不填则为透明背景)              | <em>string</em>    | ``      |
| type             | 指定 canvas 类型  | <em>string</em> | `2d`  |
| openSmooth       | 是否模拟压感           | <em>boolean</em>   | `false`       |
| beforeDelay       | 延时初始化，在放在弹窗里可以使用 （毫秒）          | <em>number</em>   | `0`       |
| maxHistoryLength   | 限制历史记录数，即最大可撤销数，传入0则关闭历史记录功能           | <em>boolean</em>   | `20`       |
| landscape        | 横屏           | <em>boolean</em>   | ``       |
| disableScroll     | 当在写字时，禁止屏幕滚动以及下拉刷新           | <em>boolean</em>   | `true`       |
| disabled         | 禁用           | <em>boolean</em>   | `false`       |
| boundingBox     | 只生成内容区域，即未画部分不生成，有性能的损耗（微信小程序pc不支持） | <em>boolean</em>   | `false`       |


### 事件 Events

| 事件名  | 说明         | 回调           |
| ------- | ------------ | -------------- |
| undo | 撤消，回退到上一步 |  |
| clear | 清空，清空画板 |  |
| canvasToTempFilePath | 保存，生成图片，与官方保持一致，但不需要传canvasId |  |

### 常见问题
- 放在弹窗里时，尺寸不对 可以延时手写板出现时机，给手写板加vif或beforeDelay="300"
- boundingBox 微信小程序 pc 不支持, 因为获取不到 ImageData 数据
- backgroundColor 不能设置为`transparent`,填了也没用，我在代码里排除了。因为会导致微信小程序无法生成图片

### 打赏
如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。   
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png)
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png)