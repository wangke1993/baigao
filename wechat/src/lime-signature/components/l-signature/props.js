export default {
	styles: String,
	disableScroll: {
		type: Boolean,
		default: true
	},
	type: {
		type: String,
		default: '2d'
	},
	// 画笔颜色
	penColor: {
		type: String,
		default: 'black'
	},
	penSize: {
		type: Number,
		default: 2
	},
	// 画板背景颜色
	backgroundColor: String,
	// 笔锋
	openSmooth: Boolean,
	// 画笔最小值
	minLineWidth: {
		type: Number,
		default: 2
	},
	// 画笔最大值
	maxLineWidth: {
		type: Number,
		default: 6
	},
	// 画笔达到最小宽度所需最小速度(px/ms)，取值范围1.0-10.0，值越小，画笔越容易变细，笔锋效果会比较明显，可以自行调整查看效果，选出自己满意的值。
	minSpeed: {
		type: Number,
		default: 1.5
	},
	// 相邻两线宽度增(减)量最大百分比，取值范围1-100，为了达到笔锋效果，画笔宽度会随画笔速度而改变，如果相邻两线宽度差太大，过渡效果就会很突兀，使用maxWidthDiffRate限制宽度差，让过渡效果更自然。可以自行调整查看效果，选出自己满意的值。
	maxWidthDiffRate: {
		type: Number,
		default: 20
	},
	// 限制历史记录数，即最大可撤销数，传入0则关闭历史记录功能
	maxHistoryLength: {
		type: Number,
		default: 20
	},
	beforeDelay: {
		type: Number,
		default: 0
	},
	landscape: {
		type: Boolean
	},
	boundingBox: {
		type: Boolean
	},
	disabled: {
		type: Boolean
	}
}