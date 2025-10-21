import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// ✅ 加上全域 CSS
import './assets/main.css';
import './assets/global.css';

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
