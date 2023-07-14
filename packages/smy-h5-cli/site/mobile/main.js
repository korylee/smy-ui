import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import './touchEmulator'

const app = createApp(App)
app.use(router)

app.mount('#app')
