import App from './App'
import Vue from 'vue'
import uView from "uview-ui";
import store from './store'
import 'utils/globalSet.js'
Vue.use(uView);
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()