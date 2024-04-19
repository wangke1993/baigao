export const uniContext = (canvasId, context) => {
	let ctx = uni.createCanvasContext(canvasId, context)
	if (!ctx.uniDrawImage) {
		ctx.uniDrawImage = ctx.drawImage
		ctx.drawImage = (image, ...agrs) => {
			ctx.uniDrawImage(image.src, ...agrs)
		}
	}
	if (!ctx.getImageData) {
		ctx.getImageData = (x, y, width, height) => {
			return new Promise((resolve, reject) => {
				// #ifdef MP || VUE2
				if (context.proxy) context = context.proxy
				// #endif
				uni.canvasGetImageData({
					canvasId,
					x,
					y,
					width,
					height,
					success(res) {
						resolve(res)
					},
					fail(error) {
						reject(error)
					}
				}, context)
			})
		}
	}

	return ctx
}

class Image {
	constructor() {
		this.currentSrc = null
		this.naturalHeight = 0
		this.naturalWidth = 0
		this.width = 0
		this.height = 0
		this.tagName = 'IMG'
	}
	set src(src) {
		this.currentSrc = src
		uni.getImageInfo({
			src,
			success: (res) => {
				this.naturalWidth = this.width = res.width
				this.naturalHeight = this.height = res.height
				this.onload()
			},
			fail: () => {
				this.onerror()
			}
		})
	}
	get src() {
		return this.currentSrc
	}
}

export const createImage = () => {
	return new Image()
}
export function useCurrentPage() {
	const pages = getCurrentPages();
	return pages[pages.length - 1];
}
export const toDataURL = (canvasId, context, options = {}) => {
	// #ifdef MP-QQ
	// context = context.$scope
	// #endif
	// #ifdef MP-ALIPAY
	context = ''
	// #endif
	return new Promise((resolve, reject) => {
		let {canvas, width, height, destWidth = 0, destHeight = 0, x = 0, y = 0} = options
		
		// #ifdef MP-ALIPAY
		const {pixelRatio} =uni.getSystemInfoSync()
		if(!destWidth || !destHeight) {
			destWidth = width * pixelRatio;
			destHeight = height * pixelRatio;
			width = destWidth;
			height = destHeight;
			x = x * pixelRatio
			y = y * pixelRatio
		} 
		// #endif
		const params = {
			...options,
			canvasId,
			id: canvasId,
			// #ifdef MP-ALIPAY
			x, 
			y,
			width,
			height,
			destWidth,
			destHeight,
			// #endif
			canvas,
			success: (res) => {
				resolve(res.tempFilePath)
			},
			fail: (err) => {
				reject(err)
			}
		}
		if(canvas && canvas.toTempFilePath) {
			canvas.toTempFilePath(params)
		} else {
			uni.canvasToTempFilePath(params, context)
		}
	})

}