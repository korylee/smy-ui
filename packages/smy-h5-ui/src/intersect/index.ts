import type { DirectiveBinding, App } from 'vue'
import { useIntersectionObserver } from '../composables/useIntersectionObserver'

interface IntersectHTMLElement extends HTMLElement {
  _observe?: Record<number, { init: boolean; observer: IntersectionObserver; stop: any }>
}

type ObserveHandler = (
  isIntersecting: boolean,
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void

export interface ObserveDirectiveBinding extends Omit<DirectiveBinding, 'modifiers' | 'value'> {
  value?: ObserveHandler | { handler: ObserveHandler; options?: IntersectionObserverInit }
  modifiers: {
    once?: boolean
    quiet?: boolean
  }
}

function mounted(target: HTMLElement, binding: ObserveDirectiveBinding) {
  const { modifiers = {}, value, instance } = binding
  const el: IntersectHTMLElement = target
  const { handler, options } = typeof value === 'object' ? value : { handler: value, options: {} }
  const {
    stop,
    observer,
    isIntersecting: _isIntersecting,
  } = useIntersectionObserver(
    target,
    (entries, observer) => {
      const _observe = el._observe?.[binding.instance!.$.uid]
      if (!_observe) return
      const isIntersecting = _isIntersecting.value
      /** 所提供的处理程序函数仅在元素第一次可见时调用一次。*/
      const isOnce = !modifiers.once || isIntersecting || _observe.init

      /** 如果在创建IntersectionObserver时元素是可见的，将不调用处理程序函数*/
      const isQuiet = !modifiers.quiet || _observe.init
      if (handler && isQuiet && isOnce) {
        handler(isIntersecting, entries, observer)
      }

      if (_isIntersecting && modifiers.once) {
        unmounted(target, binding)
      } else {
        _observe.init = true
      }
    },
    options
  )
  el._observe = Object(el._observe)
  el._observe![instance!.$.uid] = { init: false, observer, stop }
}

function unmounted(target: HTMLElement, binding: ObserveDirectiveBinding) {
  const el: IntersectHTMLElement = target
  const { instance } = binding
  const observe = el._observe?.[instance!.$.uid]
  if (!observe) return
  observe.stop()
}

export const Intersect = {
  mounted,
  unmounted,
  install(app: App) {
    app.directive('intersect', this)
  },
}

export default Intersect
