import Vue from 'vue'
import { IN_BROWSER } from '@smy-h5/shared'

let hidden: { value: boolean }
export function usePageHidden() {
  if (!hidden) {
    hidden = Vue.observable({ value: false })
    if (IN_BROWSER) {
      const update = () => {
        hidden.value = document.hidden
      }
      update()
      window.addEventListener('visibilitychange', update)
    }
  }
  return hidden
}
