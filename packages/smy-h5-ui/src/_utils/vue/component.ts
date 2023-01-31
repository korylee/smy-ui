import type { ComponentOptions, CreateElement, VueConstructor } from 'vue'
import type { CombinedVueInstance } from 'vue/types/vue'
import Vue from 'vue'

type Component = any

function registerComponent(app: VueConstructor, name: string, component: Component) {
  const registered = app.component(name)
  if (!registered) {
    app.component(name, component)
  }
}

export function createInstall(component: Component) {
  return function install(app: VueConstructor) {
    const { name, alias } = component
    registerComponent(app, name, component)
    if (alias) {
      alias.forEach((alia: string) => {
        registerComponent(app, alia, component)
      })
    }
  }
}

export function withInstall(component: Component): Component {
  component.install = createInstall(component)
  return component
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
  render(h: CreateElement, context: any) {
    const { props, parent } = context
    return typeof props.render === 'function' ? props.render.call(parent, h, context) : props.render
  },
}

interface MountComponentApi {
  instance: CombinedVueInstance<any, any, any, any, any>
  unmount(): void
}

export function mountComponent(component: ComponentOptions<Vue>, container = 'body', options = {}): MountComponentApi {
  const instance = new (Vue.extend(component))(options)
  const el = instance.$mount().$el
  const wrapper = document.querySelector(container)
  if (!wrapper) throw new Error(`can not query selector ${container}`)
  wrapper.appendChild(el)
  return {
    instance,
    unmount() {
      instance.$destroy()
      wrapper.removeChild(el)
    },
  }
}
