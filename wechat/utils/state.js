export class userLoginOpenIdState {
	static key = 'BG_WECHAT_LOGIN_USER_OPENID';
	static set(openId) {
		uni.setStorageSync(this.key, openId);
	}
	static get() {
		return uni.getStorageSync(this.key);
	}
	static remove() {
		return uni.removeStorageSync(this.key);
	}
}
// TODO:纯前端记录登录时间，逻辑不严谨，应该统一由服务端记录，后续有空可改进
export class userLoginLastTime {
	static key = 'BG_WECHAT_LOGIN_LAST_TIME';
	static set() {
		const time = this.get();
		if (time) {
			// 第二次登录
			const timeQueue = JSON.parse(time);
			if(timeQueue.length>=2){
				timeQueue.pop();
			}
			timeQueue.unshift(new Date().toString());
			uni.setStorageSync(this.key, JSON.stringify(timeQueue))
		} else {
			// 第一次登录
			const timeQueue = [];
			timeQueue.push(new Date().toString());
			uni.setStorageSync(this.key, JSON.stringify(timeQueue))
		}
	}
	static getLast() {
		let timeArr = this.get();
		if (timeArr) {
			timeArr = JSON.parse(timeArr);
			return timeArr[1];
		} else {
			return ''
		}
	}
	static get() {
		return uni.getStorageSync(this.key);
	}
	static remove() {
		return uni.removeStorageSync(this.key);
	}
}
