import Vue from 'vue'
import App from './App.vue'
import Cell from '../components/cell'
import router from './router'

import './touchEmulator'

Vue.use(Cell)

new Vue({ router, render: (h) => h(App) }).$mount('#app')
