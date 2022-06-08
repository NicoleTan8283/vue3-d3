import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue';
import '@/assets/preflight.css'
// element-pluse 插件按需导入导致ElMessage 无样式
import 'element-plus/theme-chalk/el-message.css';
import 'virtual:windi.css'
createApp(App).use(router as any).component('SvgIcon', SvgIcon).mount('#app')
