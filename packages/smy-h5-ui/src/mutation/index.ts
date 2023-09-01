import type { VNode, VNodeDirective, VueConstructor } from 'vue'
import { isFunction } from '../_utils/is'
import { keys } from '../_utils/shared'

interface MutationHTMLElement extends HTMLElement {
  _mutate?: Record<number, { observer: MutationObserver }>
}

export interface ObserveVNodeDirective extends Omit<VNodeDirective, 'modifiers'> {
  value?: MutationCallback | { handler: MutationCallback; options?: MutationObserverInit }
  modifiers?: {
    once?: boolean
    immediate?: boolean
    attr?: boolean
    char?: boolean
    child?: boolean
    sub?: boolean
  }
}

function inserted(el: MutationHTMLElement, binding: ObserveVNodeDirective, vnode: VNode) {
  const { modifiers = {}, value } = binding
  const uid = (vnode.context as any)._uid as number
  if (!value) return
  const { once, immediate, ...modifierKeys } = modifiers
  const defaultValue = !keys(modifierKeys).length
  const { handler, options } = isFunction(value)
    ? {
        handler: value,
        options: {
          attributes: modifierKeys.attr ?? defaultValue,
          characterData: modifierKeys.char ?? defaultValue,
          childList: modifierKeys.child ?? defaultValue,
          subtree: modifierKeys.sub ?? defaultValue,
        },
      }
    : value

  const instance = new MutationObserver((mutations: MutationRecord[] = [], observer: MutationObserver) => {
    handler?.(mutations, observer)
    if (once) {
      unbind(el, binding, vnode)
    }
  })

  if (immediate) {
    handler?.([], instance)
  }

  el._mutate = Object(el._mutate)
  el._mutate![uid] = { observer: instance }

  instance.observe(document.body, options)
}

function unbind(el: MutationHTMLElement, binding: ObserveVNodeDirective, vnode: VNode) {
  const uid = (vnode.context as any)._uid as number
  const observe = el._mutate?.[uid]
  if (!observe) return

  observe.observer.disconnect()
  delete el._mutate![uid]
}

export const Mutation = {
  inserted,
  unbind,
  install(app: VueConstructor) {
    app.directive('mutation', this)
  },
}

export default Mutation
