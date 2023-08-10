import { App, Component, createApp, createVNode, render } from 'vue'

export type WithInstall<T> = T & {
  install(app: App): void
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

export function mountComponent(component: Component) {
  const app = createApp(component)
  const container = document.createElement('div')
  document.body.appendChild(container)
  return {
    instance: app.mount(container),
    unmount() {
      app.unmount()
      document.body.removeChild(container)
    },
  }
}
