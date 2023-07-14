import { createRouter, createWebHashHistory } from 'vue-router'
// @ts-ignore
import config from '@config'
// @ts-ignore
import routes from '@pc-routes'
import { isPhone } from '../utils'

const redirect = config.pc?.redirect
const mobileRedirect = config.mobile?.redirect

if (redirect) {
  routes.push({
    path: '/:catchAll(.*)',
    redirect: `${redirect}`,
  })
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
/**
router.beforeEach((to, from, next) => {
  if (to.path === from.path) return
  if (isPhone()) {
    window.location.href = `./mobile.html#${to.path}`
    return
  }
  next()
})

Object.defineProperty(window, 'onMobileRouteChange', {
  value(path, replace) {
    if (path === mobileRedirect) {
      return void  router.replace(`/${replace}`)
    }
    router.replace(path)
  },
})

Object.defineProperty(window, 'scrollToMenu', {
  value: (docName) => {
    requestAnimationFrame(() => {
      const cell = document.getElementById(docName)
      const scroller = cell?.parentNode
      if (!cell || !scroller) return
      // @ts-ignore
      scroller.scrollTo({ top: cell.offsetTop - scroller.offsetHeight / 2 })
    })
  },
})
 */
export default router
