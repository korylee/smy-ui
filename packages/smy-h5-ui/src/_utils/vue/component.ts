import { App } from 'vue'

type Component = any

function registerComponent(app: App<Element>, name: string, component: Component) {
  const registered = app.component(name)
  if (!registered) {
    app.component(name, component)
  }
}

export function createInstall(component: Component) {
  return function install(app: App<Element>) {
    const { name } = component
    registerComponent(app, name, component)
  }
}

export function withInstall(component: Component): Component {
  component.install = createInstall(component)
  return component
}
