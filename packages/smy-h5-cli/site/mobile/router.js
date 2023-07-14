import routes from '@mobile-routes'
import config from '@config'
import { createRouter, createWebHashHistory } from 'vue-router'
import { get } from 'lodash-es'
import { inIframe, isPhone } from '../utils'

const redirect = get(config, 'mobile.redirect')

if (redirect) {
  routes.push({
    path: '/:catchAll(.*)',
    redirect,
  })
}

routes.push({
  path: '/home',
  name: 'home',
  component: () => import('./components/AppHome.vue'),
})

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
/**
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
 */
export default router
