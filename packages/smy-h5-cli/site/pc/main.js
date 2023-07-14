import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Button from '../components/button'

const app = createApp(App)
app.component(Button.name, Button)
app.use(router)

app.mount('#app')
