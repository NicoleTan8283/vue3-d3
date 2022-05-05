import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue';
import 'virtual:windi.css'
createApp(App).use(router).component('SvgIcon', SvgIcon).mount('#app')
