import Vue from 'vue'

export function mountComponent(component, container, options = {}) {
  const instance = new (Vue.extend(component))(options)
  const el = instance.$mount().$el
  const wrapper = document.querySelector(container)
  wrapper.appendChild(el)
  return {
    instance,
    unmount() {
      instance.$destory()
      wrapper.removeChild(el)
    },
  }
}
