import type { VueConstructor } from 'vue'

function registerComponent(app: VueConstructor, name: string, component: any) {
  const registered = app.component(name)
  if (!registered) {
    app.component(name, component)
  }
}

export function createInstall(component: any) {
  return function install(app: VueConstructor) {
    const { name, alias } = component
    registerComponent(app, name, component)
    if (alias) {
      alias.forEach((alia) => {
        registerComponent(app, alia, component)
      })
    }
  }
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

export const RenderToComp = {
  name: 'RenderToComp',
  functional: true,
  props: {
    render: Function,
  },
  render(h, context) {
    const { props, parent } = context
    return typeof props.render === 'function' ? props.render.call(parent, h, context) : props.render
  },
}
