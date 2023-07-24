import type { VNode, VNodeDirective, VueConstructor } from 'vue'
import { isFunction } from '../_utils/is'

import './polyfill'

interface IntersectHTMLElement extends HTMLElement {
  _observe?: Record<number, { init: boolean; observer: IntersectionObserver }>
}

type ObserveHandler = (
  isIntersecting: boolean,
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void

export interface ObserveVNodeDirective extends Omit<VNodeDirective, 'modifiers'> {
  value?: ObserveHandler | { handler: ObserveHandler; options?: IntersectionObserverInit }
  modifiers?: {
    once?: boolean
    quiet?: boolean
  }
}

function inserted(el: IntersectHTMLElement, binding: ObserveVNodeDirective, vnode: VNode) {
  const { modifiers = {}, value } = binding
  const uid = (vnode.context as any)._uid as number
  if (!value) return
  const { handler, options } = isFunction(value) ? { handler: value, options: {} } : value

  const instance = new IntersectionObserver((entries = [], observer) => {
    const _observe = el._observe?.[uid]
    if (!_observe) return
    const isIntersecting = entries.some((entry) => entry.isIntersecting)
    /** 所提供的处理程序函数仅在元素第一次可见时调用一次。*/
    const isOnce = !modifiers.once || isIntersecting || _observe.init

    /** 如果在创建IntersectionObserver时元素是可见的，将不调用处理程序函数*/
    const isQuiet = !modifiers.quiet || _observe.init
    if (handler && isQuiet && isOnce) {
      handler(isIntersecting, entries, observer)
    }

    if (isIntersecting && modifiers.once) {
      unbind(el, binding, vnode)
    } else {
      _observe.init = true
    }
  }, options)
  el._observe = el._observe ?? Object.create(null)
  el._observe![uid] = { init: false, observer: instance }

  instance.observe(el)
}

function unbind(el: IntersectHTMLElement, binding: ObserveVNodeDirective, vnode: VNode) {
  const uid = (vnode.context as any)._uid as number
  const observe = el._observe?.[uid]
  if (!observe) return

  observe.observer.unobserve(el)
  delete el._observe![uid]
}

export const Intersect = {
  inserted,
  unbind,
  install(app: VueConstructor) {
    app.directive('intersect', this)
  },
}

export default Intersect
