# lsj-upload

### 插件地址：https://ext.dcloud.net.cn/plugin?id=5459

### 不清楚使用方式可点击右侧导入示例项目运行完整示例
### 此次更新2.0与1.0使用方式略有差异，已使用1.0的同学自行斟酌是否更新到2.0版本！！！

使用插件有任何问题欢迎加入QQ讨论群：
- 群1：701468256（已满）
- 群2：469580165（已满）
- 群3：667530868

若能帮到你请高抬贵手点亮5颗星~
------
## 重要提示
### 组件是窗口级滚动，不要在scroll-view内使用！！
### 组件是窗口级滚动，不要在scroll-view内使用！！
### 组件是窗口级滚动，不要在scroll-view内使用！！

### 控件的height高度应与slot自定义内容高度保持一致
### nvue窗口只能使用固定模式position=absolute
### show() 当DOM重排后在this.$nextTick内调用show()，控件定位会更加准确
### hide() APP端webview层级比view高，如不希望触发点击时，应调用hide隐藏控件，反之调用show
### 若iOS端跨域服务端同学实在配置不好，可把hybrid下html目录放到服务器去，同源则不存在跨域问题。
### 小程序端因hybrid不能使用本地HTML，所以插件提供的是从微信消息列表拉取文件并选择，请知悉。
### file对象不是object对象，也不能转json字符串，如果你打印file那就是{}，可以打印file.name和file.size。
### 返回的path是个blob类型，仅供用于文件回显，插件已内置好上传函数，调用上传会自动提交待上传文件，若非要自己拿path去搞上传那你自己处理。
------

## 使用说明
| 属性		| 是否必填	|  值类型	| 默认值	| 说明			|
| --------- | -------- 	| -----: 	| --: 	| :------------:|
| width		|	否 		| String	|100%	| 容器宽度		|
| height	|	是 		| String	|80rpx	| 容器高度		|
| debug		|	否 		| Boolean	|false	| 打印调试日志	|
| option	|	是 		| Object	|-		| [文件上传接口相关参数](#p1)|
| instantly	|	否 		| Boolean	|false	| true=自动上传	|
| count		|	否 		| Number	|10		| 附件选择上限(个)|
| size		|	否 		| Number	|10		| 附件大小上限(M)|
| wxFileType	|	否 		| String	|all		| 微信小程序文件选择器格式限制(all=从所有文件选择，video=只能选择视频文件，image=只能选择图片文件，file=可以选择除了图片和视频之外的其它的文件)|
| accept	|	否 		| String	|-		| 文件选择器input file格式限制(部分机型不兼容，建议使用formats)|
| formats	|	否 		| String	|-		| 限制允许上传的格式，空串=不限制，默认为空，多个格式以逗号隔开，例如png,jpg,pdf|
| childId	|	否 		| String	|lsjUpload| 控件的id(仅APP有效，应用内每个控件命名一个唯一Id，不同窗口也不要同名Id)|
| position	|	否 		| String	|static	| 控件的定位模式(static=控件随页面滚动;absolute=控件在页面中绝对定位，不随窗口内容滚动)|
| top,left,right,bottom	|	否 		| [Number,String]	|0		| 设置控件绝对位置，position=absolute时有效|
| @change	|	否 		| Function	|Map	| 选择文件触发，返回所有已选择文件Map集合|
| @progress	|	否 		| Function	|Object	| 上传过程中发生状态变化的文件对象，需通过set更新至Map集合|
| @uploadEnd|	否 		| Function	|Object	| 上传结束回调，返回参数与progress一致|

## <a id="p1">option说明</a>
|参数 | 是否必填 |  说明|
|---- | ---- | :--: |
|url  |	是	| 上传接口地址|
|name| 否	|上传接口文件key，默认为file|
|header| 否	|上传接口请求头|
|formData| 否	|上传接口额外参数|

## ref调用
|作用 | 方法名| 传入参数|  说明|
|---- | --------- | -------- | :--: |
|显示控件| show|-| 控件显示状态下可触发点击|
|隐藏控件| hide|-| 控件隐藏状态下不触发点击|
|动态设置文件列表| setFiles|[Array,Map] files| 传入格式请与组件选择返回格式保持一致，且name为必须属性，可查看下方演示|
|动态更新参数| setData|[String] name,[any] value| name支持a.b 和 a[b]，可查看下方演示|
|移除选择的文件| clear|[String] name| 不传参数清空所有文件，传入文件name时删除该name的文件|
|手动上传| upload|[String] name| 不传参数默认依次上传所有type=waiting的文件，传入文件name时不关心type是否为waiting，单独上传指定name的文件|

## progress返回对象字段说明
|字段 |  说明|
|---- | :--: |
|file | 文件对象|
|name |文件名称|
|size |文件大小|
|type |文件上传状态：waiting（等待上传）、loading（上传中）、success（成功） 、fail（失败）|
|responseText|上传成功后服务端返回数据(仅type为success时存在)|

## 以下演示为vue窗口使用方式，nvue使用区别是必须传入控件绝对位置如top，bottom，left，right，且position只能为absolute，如不清楚可点击右侧导入示例项目有详细演示代码。

### vue:
``` javascript
<lsj-upload 
	ref="lsjUpload"
	childId="upload1"
	:width="width"
	:height="height"
	:option="option"
	:size="size"
	:formats="formats"
	:debug="debug"
	:instantly="instantly"
	@progress="onprogress"
	@change="onChange">
		<view class="btn" :style="{width: width,height: height}">选择附件</view>
</lsj-upload>


<view class="padding">
			
	<view>已选择文件列表：</view>
	
	<!-- #ifndef MP-WEIXIN -->
	<view v-for="(item,index) in files.values()" :key="index">
		<image style="width: 100rpx;height: 100rpx;" :src="item.path" mode="widthFix"></image>
		<text>提示：【path主要用于图片视频类文件回显，他用自行处理】：{{item.path}}</text>
		<text>{{item.name}}</text>
		<text style="margin-left: 10rpx;">大小：{{item.size}}</text>
		<text style="margin-left: 10rpx;">状态：{{item.type}}</text>
		<text style="margin-left: 10rpx;">进度：{{item.progress}}</text>
		<text style="margin-left: 10rpx;" v-if="item.responseText">服务端返回演示：{{item.responseText}}</text>
		<text @click="resetUpload(item.name)" v-if="item.type=='fail'" style="margin-left: 10rpx;padding: 0 10rpx;border: 1rpx solid #007AFF;">重新上传</text>
		<text @click="clear(item.name)" style="margin-left: 10rpx;padding: 0 10rpx;border: 1rpx solid #007AFF;">删除</text>
	</view>
	<!-- #endif -->
	
	<!-- #ifdef MP-WEIXIN -->
	<view v-for="(item,index) in wxFiles" :key="index">
		<text>{{item.name}}</text>
		<text style="margin-left: 10rpx;">大小：{{item.size}}</text>
		<text style="margin-left: 10rpx;">状态：{{item.type}}</text>
		<text style="margin-left: 10rpx;">进度：{{item.progress}}</text>
		<view>
			<button @click="resetUpload(item.name)">重新上传</button>
			<button @click="clear(item.name)">删除</button>
		</view>
	</view>
	<!-- #endif -->
	
</view>


```

---
* 函数说明


``` javascript
export default {
	data() {
		return {
			// 上传接口参数
			option: {
				// 上传服务器地址，需要替换为你的接口地址
				url: 'http://hl.j56.com/dropbox/document/upload', // 该地址非真实路径，需替换为你项目自己的接口地址
				// 上传附件的key
				name: 'file',
				// 根据你接口需求自定义请求头,默认不要写content-type,让浏览器自适配
				header: {
					// 示例参数可删除
					'Authorization': 'bearer eyJhbGciOiJSUzI1NiIsI',
					'uid': '99',
					'client': 'app',
					'accountid': 'DP',
				},
				// 根据你接口需求自定义body参数
				formData: {
					// 'orderId': 1000
				}
			},
			// 选择文件后是否立即自动上传，true=选择后立即上传
			instantly: true,
			// 必传宽高且宽高应与slot宽高保持一致
			width: '180rpx',
			height: '180rpx',
			// 限制允许上传的格式，空串=不限制，默认为空
			formats: '',
			// 文件上传大小限制
			size: 30,
			// 文件数量限制
			count: 2,
			// 文件回显列表
			files: new Map(),
			// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
			wxFiles: [],
			// 是否打印日志
			debug: true,
			
			
			// 演示用
			tabIndex: 0,
			list:[], 
		}
	},
	onReady() {
		setTimeout(()=>{
			console.log('----演示动态更新参数-----');
			this.$refs['lsjUpload'+this.tabIndex].setData('formData.orderId','动态设置的参数'); 
			
			console.log('以下注释内容为-动态更新参数更多演示，放开后可查看演示效果');
			// 修改option对象的name属性
			// this.$refs.lsjUpload.setData('name','myFile');
			
			// 修改option对象的formData内的属性
			// this.$refs.lsjUpload.setData('formData.appid','1111');
			
			// 替换option对象的formData
			// this.$refs.lsjUpload.setData('formData',{appid:'222'});
			
			// option对象的formData新增属性
			// this.$refs.lsjUpload.setData('formData.newkey','新插入到formData的属性');
			
			
			// ---------演示初始化值，用于已提交后再次编辑时需带入已上传文件-------
			// 方式1=传入数组
			// let files1 = [{name: '1.png'},{name: '2.png',}];
			
			// 方式2=传入Map对象
			// let files2 = new Map();
			// files2.set('1.png',{name: '1.png'})
			
			// 此处调用setFiles设置初始files
			// this.$refs.lsjUpload.setFiles(files1);
			
			// 初始化tab
			this.onTab(0);
		},2000)
	},
	methods: {
		// 某文件上传结束回调(成功失败都回调)
		onuploadEnd(item) {
			console.log(`${item.name}已上传结束，上传状态=${item.type}`);
			
			// 更新当前窗口状态变化的文件
			this.files.set(item.name,item);
			
			// ---可删除--演示上传完成后取服务端数据
			if (item['responseText']) {
				console.log('演示服务器返回的字符串JSON转Object对象');
				this.files.get(item.name).responseText = JSON.parse(item.responseText);
			}
			
			// 微信小程序Map对象for循环不显示，所以转成普通数组，
			// 如果你用不惯Map对象，也可以像这样转普通数组，组件使用Map主要是避免反复文件去重操作
			// #ifdef MP-WEIXIN
			this.wxFiles = [...this.files.values()];
			// #endif
			
			// 强制更新视图
			this.$forceUpdate();
			
			
			// ---可删除--演示判断是否所有文件均已上传成功
			let isAll = [...this.files.values()].find(item=>item.type!=='success');
			if (!isAll) {
				console.log('已全部上传完毕');
			}
			else {
				console.log(isAll.name+'待上传');
			}
			
		},
		// 上传进度回调
		onprogress(item) {
			// 更新当前状态变化的文件
			this.files.set(item.name,item);
			
			console.log('打印对象',JSON.stringify(this.files.get(item.name)));
			// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
			// #ifdef MP-WEIXIN
			this.wxFiles = [...this.files.values()];
			// #endif
			
			// 强制更新视图
			this.$forceUpdate();
			
		},
		// 文件选择回调
		onChange(files) {
			console.log('当前选择的文件列表：',JSON.stringify([...files.values()]));
			// 更新选择的文件 
			this.files = files;
			// 强制更新视图
			this.$forceUpdate();
			
			// 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
			// #ifdef MP-WEIXIN
			this.wxFiles = [...this.files.values()];
			// #endif
			
			// ---可删除--演示重新定位覆盖层控件
			this.$nextTick(()=>{
				console.log('演示重新定位');
				this.$refs.lsjUpload0.show();
				this.$refs.lsjUpload1.show();
				this.$refs.lsjUpload2.show();
			});
			
		},
		// 手动上传
		upload() {
			// name=指定文件名，不指定则上传所有type等于waiting和fail的文件
			this.$refs['lsjUpload'+this.tabIndex].upload();
		},
		// 指定上传某个文件
		resetUpload(name) {
			this.$refs['lsjUpload'+this.tabIndex].upload(name);
		},
		// 移除某个文件
		clear(name) {
			// name=指定文件名，不传name默认移除所有文件
			this.$refs['lsjUpload'+this.tabIndex].clear(name);
		},
		/**
		 * ---可删除--演示在组件上方添加新内容DOM变化
		 * DOM重排演示，重排后组件内部updated默认会触发show方法,若特殊情况未能触发updated也可以手动调用一次show()
		 * 什么是DOM重排？自行百度去
		 */
		add() {
			this.list.push('DOM重排测试');
		},
		/**
		 * ---可删除--演示Tab切换时覆盖层是否能被点击
		 * APP端因为是webview，层级比view高，此时若不希望点击触发选择文件，需要手动调用hide()
		 * 手动调用hide后，需要调用show()才能恢复覆盖层的点击
		 */
		onTab(tabIndex) {
			this.$refs.lsjUpload0.hide();
			this.$refs.lsjUpload1.hide();
			
			this.tabIndex = tabIndex;
			
			this.$nextTick(()=>{
				this.$refs['lsjUpload'+this.tabIndex].show();
			})
			
		},
		/**
		 * 打开nvue窗口查看非跟随窗口滚动效果
		 */
		open() {
			uni.navigateTo({
				url: '/pages/nvue-demo/nvue-demo'
			});
		}
	}
}

```

## 温馨提示
	
* 文件上传
0. 如说明表达还不够清楚，不清楚怎么使用可导入完整示例项目运行体验和查看	
1. APP端请优先联调Android,上传成功后再运行iOS端，如iOS返回status=0则需要后端开启允许跨域；
2. header的Content-Type类型需要与服务端要求一致，否则收不到附件（服务端若没有明文规定则可不写，使用默认匹配）
3. 服务端不清楚怎么配置跨域可加群咨询，具体百度~
4. 欢迎加入QQ讨论群：701468256(已满)
5. 欢迎加入QQ讨论群：469580165(已满)
6. 欢迎加入QQ讨论群：667530868
7. 若能帮到你还请点亮5颗小星星以作鼓励哈~
8. 若能帮到你还请点亮5颗小星星以作鼓励哈~
9. 若能帮到你还请点亮5颗小星星以作鼓励哈~