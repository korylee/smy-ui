import routes from '@mobile-routes'
import config from '@config'
import VueRouter from 'vue-router'
import Vue from 'vue'
import { inIframe, isPhone } from '../utils'

const originalReplace = VueRouter.prototype.replace

Vue.prototype.replace = function replace(location, onResolve, onReject) {
  if (onReject || onResolve) {
    return originalReplace.call(this, location, onResolve, onReject)
  }
  return originalReplace.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

const redirect = config?.mobile?.redirect

if (redirect) {
  routes.push({
    path: '*',
    redirect,
  })
}

routes.push({
  path: '/home',
  name: 'home',
  component: () => import('./components/AppHome.vue'),
})

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,
})

router.beforeEach((to, from, next) => {
  const path = to.path
  const replace = to.query.replace
  if (!isPhone() && !inIframe()) {
    window.location.href = `./#${path}`
    return
  }
  if (!isPhone() && inIframe()) {
    // @ts-ignore
    window.top.onMobileRouteChange(path, replace)
  }
  next()
})

export default router
