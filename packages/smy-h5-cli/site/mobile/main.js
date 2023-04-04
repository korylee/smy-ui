import Vue from 'vue'
import App from './App.vue'
import router from './router'
import AppDemoTitle from './components/app-demo-title'
import './touchEmulator'

Vue.use(AppDemoTitle)

new Vue({ router, render: (h) => h(App) }).$mount('#app')
