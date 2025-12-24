import { createApp } from 'vue'

import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 1. 引入路由配置
import router from './router'

const app = createApp(App)

app.use(ElementPlus)
// 2. 挂载路由
app.use(router)

app.mount('#app')