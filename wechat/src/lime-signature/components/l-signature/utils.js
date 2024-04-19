export function compareVersion(v1, v2) {
	v1 = v1.split('.')
	v2 = v2.split('.')
	const len = Math.max(v1.length, v2.length)
	while (v1.length < len) {
		v1.push('0')
	}
	while (v2.length < len) {
		v2.push('0')
	}
	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i], 10)
		const num2 = parseInt(v2[i], 10)

		if (num1 > num2) {
			return 1
		} else if (num1 < num2) {
			return -1
		}
	}
	return 0
}

function gte(version) {
	let { SDKVersion } = uni.getSystemInfoSync() 
  // #ifdef MP-ALIPAY
  SDKVersion = my.SDKVersion
  // #endif
  return compareVersion(SDKVersion, version) >= 0;
}

export function canIUseCanvas2d() {
	// #ifdef MP-WEIXIN
	return gte('2.9.0');
	// #endif
	// #ifdef MP-ALIPAY
	return gte('2.7.0');
	// #endif
	// #ifdef MP-TOUTIAO
	return gte('1.78.0');
	// #endif
	return false
}


export const wrapEvent = (e) => {
  if (!e) return;
  if (!e.preventDefault) {
    e.preventDefault = function() {};
  }
  return e;
}

export const requestAnimationFrame = (cb) => {
	setTimeout(cb, 30)
}

// #ifdef MP
export const prefix = () => {
	// #ifdef MP-TOUTIAO
	return tt
	// #endif
	// #ifdef MP-WEIXIN
	return wx
	// #endif
	// #ifdef MP-BAIDU
	return swan
	// #endif
	// #ifdef MP-ALIPAY
	return my
	// #endif
	// #ifdef MP-QQ
	return qq
	// #endif
	// #ifdef MP-360
	return qh
	// #endif
}
// #endif

/**
 * base64转路径
 * @param {Object} base64
 */
export function base64ToPath(base64) {
	const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64) || [];
	return new Promise((resolve, reject) => {
		// #ifdef MP
		const p = prefix()
		const fs = p.getFileSystemManager()
		//自定义文件名
		if (!format) {
			reject(new Error('ERROR_BASE64SRC_PARSE'))
		}
		const time = new Date().getTime();
		const filePath = `${p.env.USER_DATA_PATH}/${time}.${format}`;
		fs.writeFile({
			filePath,
			data: base64.split(',')[1],
			encoding: 'base64',
			success() {
				resolve(filePath)
			},
			fail(err) {
				reject(err)
			}
		})
		// #endif
		// #ifdef APP-PLUS
		const bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
		bitmap.loadBase64Data(base64, () => {
			if (!format) {
				reject(new Error('ERROR_BASE64SRC_PARSE'))
			}
			const time = new Date().getTime();
			const filePath = `_doc/uniapp_temp/${time}.${format}`
			bitmap.save(filePath, {},
				() => {
					bitmap.clear()
					resolve(filePath)
				},
				(error) => {
					bitmap.clear()
					reject(error)
				})
		}, (error) => {
			bitmap.clear()
			reject(error)
		})
		// #endif
	})
}


export function sleep(delay) {
	return new Promise(resolve => setTimeout(resolve, delay))
}

export function getRect(selector, options = {}) {
	const typeDefault = 'boundingClientRect'
	const { context, type = typeDefault} = options
	return new Promise((resolve, reject) => {
		const dom = uni.createSelectorQuery().in(context).select(selector);
		const result = (rect) => {
			if(rect) {
				 resolve(rect)
			} else {
				reject()
			}
		}
		if(type == typeDefault) {
			dom[type](result).exec()
		} else {
			dom[type]({
				node: true,
				size: true,
				rect: true
			}, result).exec()
		}
	});
};

export function isTransparent(color) {
  // 判断颜色是否为 transparent
  if (color === 'transparent') {
    return true;
  }

  // 判断颜色是否为 rgba 的 a 为 0
  if (color.startsWith('rgba')) {
    const regex = /\d+(\.\d+)?/g;
    const matches = color.match(regex);
    if (matches !== null) {
      const alpha = parseFloat(matches[3]);
      if (alpha === 0) {
        return true;
      }
    }
  }
  return false;
}