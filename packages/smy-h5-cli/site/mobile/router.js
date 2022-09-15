import routes from '@mobile-routes'
import config from '@config'
import VueRouter from 'vue-router'
import Vue from 'vue'
import { get } from 'lodash-es'
import { inIframe, isPhone } from '../utils'

Vue.use(VueRouter)

const redirect = get(config, 'mobile.redirect')

if (redirect) {
  routes.push({
    path: '*',
    redirect
  })
}

routes.push({
  path: '/home',
  component: () => import('./components/AppHome.vue')
})

console.log(routes)
const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
})

router.beforeEach((to, from, next) => {
  const path = to.path
  const replace = to.query.replace
  console.log(path,replace)
  if (!isPhone() && !inIframe()) {
    window.location.href = `./#/${path}`
    return
  }
  if (!isPhone() && inIframe()) {
    window.top.onMobileRouteChange(path, replace)
  }
  next()
})

export default router
