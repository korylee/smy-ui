import Vue from 'vue'
import VueRouter from 'vue-router'
// @ts-ignore
import config from '@config'
// @ts-ignore
import routes from '@pc-routes'
const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  }
  return originalReplace.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

const redirect = config.pc?.redirect
const mobileRedirect = config.mobile?.redirect

if (redirect) {
  routes.push({
    path: '*',
    redirect: `${redirect}`,
  })
}

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,
})

Object.defineProperty(window, 'onMobileRouteChange', {
  value(path, replace) {
    if (path === mobileRedirect) {
      router.replace(`/${replace}`)
      return
    }
    router.replace(path)
  },
})

Object.defineProperty(window, 'scrollToMenu', {
  value: (docName) => {
    setTimeout(() => {
      const cell = document.getElementById(docName)
      const scroller = cell?.parentNode
      if (!cell || !scroller) return
      // @ts-ignore
      scroller.scrollTo({ top: cell.offsetTop - scroller.offsetHeight / 2 })
    })
  },
})

export default router
