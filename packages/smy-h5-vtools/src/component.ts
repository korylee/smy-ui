import Vue from 'vue'
import type { ComponentOptions } from 'vue'
import type { CombinedVueInstance } from 'vue/types/vue'

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
