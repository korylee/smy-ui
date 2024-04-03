import Vue from 'vue'
import { IN_BROWSER } from '@smy-h5/shared'

type WindowSize = { width: number; height: number }

let windowSize: WindowSize

export function useWindowSize() {
  if (!windowSize) {
    windowSize = Vue.observable<WindowSize>({ width: 0, height: 0 })
    if (IN_BROWSER) {
      const update = () => {
        windowSize.width = window.innerWidth
        windowSize.height = window.innerHeight
      }
      update()
      window.addEventListener('resize', update, { passive: true })
      window.addEventListener('orientationchange', update, { passive: true })
    }
  }
  return windowSize
}
