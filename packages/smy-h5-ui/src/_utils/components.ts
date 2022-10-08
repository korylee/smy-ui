import type { VueConstructor } from 'vue'

export declare class SmyComponent {
  static name: string
  static install(app: VueConstructor): void
}

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
