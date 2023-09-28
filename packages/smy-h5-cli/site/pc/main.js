import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'
import CodeExample from './components/code-example'
import Button from '../components/button'
import Code from './components/code'

Vue.use(Button).use(CodeExample).use(Code)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
