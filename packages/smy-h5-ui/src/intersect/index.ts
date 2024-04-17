import type { VNode, VNodeDirective, VueConstructor } from 'vue'
import { IN_BROWSER, isFunction } from '@smy-h5/shared'

const IsSupportIntersectionObserver = IN_BROWSER && 'IntersectionObserver' in window

interface IntersectHTMLElement extends HTMLElement {
  _intersect?: Record<number, { init: boolean; observer: IntersectionObserver }>
}

type ObserveHandler = (
  isIntersecting: boolean,
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void

export interface ObserveVNodeDirective extends Omit<VNodeDirective, 'modifiers'> {
  value?: ObserveHandler | { handler: ObserveHandler; options?: IntersectionObserverInit }
  modifiers?: {
    once?: boolean
    quiet?: boolean
  }
}

function inserted(el: IntersectHTMLElement, binding: ObserveVNodeDirective, vnode: VNode) {
  if (!IsSupportIntersectionObserver) {
    return
  }
  const { modifiers = {}, value } = binding
  const uid = (vnode.context as any)._uid as number
  if (!value) return
  const { handler, options } = isFunction(value) ? { handler: value, options: {} } : value

  const instance = new IntersectionObserver((entries = [], observer) => {
    const _intersect = el._intersect?.[uid]
    if (!_intersect) return
    const isIntersecting = entries.some((entry) => entry.isIntersecting)
    /** 所提供的处理程序函数仅在元素第一次可见时调用一次。*/
    const isOnce = !modifiers.once || isIntersecting || _intersect.init

    /** 如果在创建IntersectionObserver时元素是可见的，将不调用处理程序函数*/
    const isQuiet = !modifiers.quiet || _intersect.init
    if (handler && isQuiet && isOnce) {
      handler(isIntersecting, entries, observer)
    }

    if (isIntersecting && modifiers.once) {
      unbind(el, binding, vnode)
    } else {
      _intersect.init = true
    }
  }, options)
  el._intersect = el._intersect ?? Object.create(null)
  el._intersect![uid] = { init: false, observer: instance }

  instance.observe(el)
}

function unbind(el: IntersectHTMLElement, binding: ObserveVNodeDirective, vnode: VNode) {
  const uid = (vnode.context as any)._uid as number
  const observe = el._intersect?.[uid]
  if (!observe) return

  observe.observer.unobserve(el)
  delete el._intersect![uid]
}

export const Intersect = {
  inserted,
  unbind,
  install(app: VueConstructor) {
    app.directive('intersect', this)
  },
}

export default Intersect
