import routes from '@mobile-routes'
import config from '@config'
import VueRouter from 'vue-router'
import Vue from 'vue'
import { get } from 'lodash-es'

Vue.use(VueRouter)

const redirect = get(config, 'mobile.redirect')

if (redirect) {
  routes.push({
    path: '*',
    redirect,
  })
}

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,
})

export default router
