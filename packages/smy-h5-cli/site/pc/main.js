import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'
import CodeExample from './components/code-example'

Vue.use(CodeExample)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
