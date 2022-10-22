import type { VueConstructor } from 'vue'

function registerComponent(app: VueConstructor, name: string, component: any) {
  const registered = app.component(name)
  if (!registered) {
    app.component(name, component)
  }
}

export function withInstall(component: any) {
  function install(app) {
    const { name, alias } = component
    registerComponent(app, name, component)
    if (alias) {
      alias.forEach((alia) => {
        registerComponent(app, alia, component)
      })
    }
  }
  component.install = install
  return install
}

export function addRouteListener(vm: any, cb: () => void) {
  const add = () => {
    window.addEventListener('hashchange', cb)
    window.addEventListener('popstate', cb)
  }
  const remove = () => {
    window.removeEventListener('hashchange', cb)
    window.removeEventListener('popstate', cb)
  }
  vm.$on('hook:mounted', add)
  vm.$on('hook:activated', add)
  vm.$on('hook:deactivated', remove)
  vm.$on('hook:beforeDestory', remove)
}
