import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import QrCode from './components/qrcode'
import router from './router'

Vue.use(QrCode)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
