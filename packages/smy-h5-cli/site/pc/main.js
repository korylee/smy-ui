import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'
import CodeExample from './components/code-example'
import Button from '../components/button'

Vue.use(Button).use(CodeExample)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
