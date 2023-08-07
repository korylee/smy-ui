import { App, Component, createVNode, render } from 'vue'

export type WithInstall<T> = T & {
  withInstall(app: App): void
}

export function withInstall<T extends Component>(component: T) {
  ;(component as Record<string, unknown>).install = function install(app: App) {
    const { name } = component
    if (name) {
      app.component(name, component)
    }
  }
  return component as WithInstall<T>
}

export function mountComponent(RootComponent: Component) {
  const vnode = createVNode(RootComponent)
  const container = document.createElement('div')
  render(vnode, container)
  document.body.appendChild(container.firstElementChild!)
  return { instance: vnode }
}
