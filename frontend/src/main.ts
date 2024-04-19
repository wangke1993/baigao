import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/utils/request'
import '@/utils/routerGlobal'
import '@/styles/global.scss'
import piniaPersist from 'pinia-plugin-persist'
import { createPinia } from 'pinia'
import locale from "element-plus/lib/locale/lang/zh-cn";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(createPinia().use(piniaPersist))
app.use(ElementPlus, { locale });
app.use(router)
app.mount('#app')