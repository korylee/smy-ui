import type { ComponentOptions, FunctionalComponentOptions, VueConstructor } from 'vue'
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
    const { name } = component
    registerComponent(app, name, component)
  }
}

export function withInstall(component: Component): Component {
  component.install = createInstall(component)
  return component
}

export function addRouteListener(vm: Vue, cb: () => void) {
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

export const RenderToComp: FunctionalComponentOptions = {
  name: 'RenderToComp',
  functional: true,
  props: {
    render: Function,
  },
  render(h, context) {
    const {
      props: { render },
      parent,
    } = context

    return typeof render === 'function' ? render.call(parent, h, context) : render
  },
}

interface MountComponentApi {
  instance: CombinedVueInstance<any, any, any, any, any>
  unmount(): void
}

export function mountComponent(
  component: ComponentOptions<Vue>,
  container = 'body',
  options: ComponentOptions<Vue> = {}
): MountComponentApi {
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
export function createMaybeComponent(component: string | Component): FunctionalComponentOptions
export function createMaybeComponent(name: string, component: string | Component): FunctionalComponentOptions
export function createMaybeComponent(...args: any[]): FunctionalComponentOptions {
  const [name, component] = args.length === 1 ? ['MaybeComponent', args[0]] : args
  return {
    name,
    props: { maybe: Boolean },
    functional: true,
    render: (h, { data, props, children }) => (props.maybe ? h(component, data, children) : children),
  }
}

export const MaybeTransition = createMaybeComponent('MaybeTransition', 'transition')
