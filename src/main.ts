import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue';
import '@/assets/preflight.css'
// element-pluse 插件按需导入导致ElMessage 无样式
import 'element-plus/theme-chalk/el-message.css';
import 'virtual:windi.css'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
const pinia = createPinia();
pinia.use(piniaPersist)
createApp(App).use(router as any).use(pinia as any).component('SvgIcon', SvgIcon).mount('#app')
