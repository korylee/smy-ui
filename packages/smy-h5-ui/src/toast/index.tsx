import type { ToastProps, ToastType } from './props'
import type { VNode } from 'vue'
import type { CombinedVueInstance } from 'vue/types/vue'
import type { SmyComponent } from '../_utils/smy/component'

import { mountComponent, withInstall } from '../_utils/vue/component'
import _Toast from './Toast.vue'
import { isNumber, isPlainObject, isString } from '../_utils/is'
import Vue from 'vue'
import { TOAST_TYPES } from './props'
import { throwError } from '../_utils/smy/warn'
import { assign, keys } from '../_utils/shared'

declare interface SmyToast extends SmyComponent {
  new (): {
    $props: ToastProps
    $scopeSlots: {
      default: () => VNode
      icon: () => VNode
    }
    $emit: {
      (event: 'open'): void
      (event: 'opened'): void
      (event: 'close'): void
      (event: 'closed'): void
      (event: 'route-change'): void
    }
  }
}

const _SmyToast = withInstall(_Toast) as unknown as SmyToast

export type ReactiveToastOptions = Partial<ToastProps> & {
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
}

type NeverRecord = Record<string, never>

type ToastInstance = CombinedVueInstance<
  Vue,
  { content: string },
  { close: () => void; open: (opts: ReactiveToastOptions) => void },
  NeverRecord,
  NeverRecord
>

let isAllowMultiple = false
let queue: ToastInstance[] = []

const getDefaultOptions = (): ReactiveToastOptions => ({
  type: undefined,
  content: '',
  position: 'center',
  duration: 3500,
  contentClass: undefined,
  loadingType: 'circle',
  loadingSize: undefined,
  lockScroll: false,
  teleport: undefined,
  forbidClick: false,
  icon: undefined,
})

let currentOptions = getDefaultOptions()

let defaultOptionsMap: { [key in ToastType]?: Omit<ReactiveToastOptions, 'type'> } = {}

const Toast = function toast(options: number | string | ReactiveToastOptions) {
  const toastOptions = isString(options) || isNumber(options) ? { content: String(options) } : options
  const reactiveToastOptions = Vue.observable({
    ...currentOptions,
    ...(toastOptions.type && defaultOptionsMap[toastOptions.type]),
    ...toastOptions,
  })
  const instance = getInstance()
  instance.open(reactiveToastOptions)

  return instance
}

const getToast =
  (type: ToastType) =>
  (options: Parameters<typeof Toast>[0] = {}) => {
    if (!isPlainObject(options)) {
      options = { content: String(options), type }
    } else {
      options.type = type
    }
    return Toast(options)
  }

const Toasts = TOAST_TYPES.reduce((acc, cur) => {
  acc[cur] = getToast(cur)
  return acc
}, {} as { [type in ToastType]: ReturnType<typeof getToast> })

Toast.allowMultiple = function allowMultiple(bool = true) {
  if (!bool !== isAllowMultiple) {
    isAllowMultiple = bool
  }
}

function close(all = false) {
  if (!queue.length) return
  if (all) {
    queue.forEach((toast) => {
      toast.close()
    })
    queue = []
  } else if (!isAllowMultiple) {
    queue[0].close()
  } else {
    queue.shift()?.close()
  }
}

Toast.close = close

function setDefaultOptions(value: ReactiveToastOptions): void
function setDefaultOptions(key: ToastType, value: Omit<ReactiveToastOptions, 'type'>): void
function setDefaultOptions(key: ToastType | Partial<ReactiveToastOptions>, value?: Partial<ReactiveToastOptions>) {
  if (isString(key)) {
    if (!isPlainObject(value)) {
      throwError('toast', `setDefaultOptions 设置${key}对应的值必须是对象`)
    }
    delete value.type
    defaultOptionsMap[key] = value
  } else {
    assign(currentOptions, key)
  }
}

Toast.setDefaultOptions = setDefaultOptions

Toast.resetDefaultOptions = function resetDefaultOptions(type: ToastType) {
  if (type && isString(type)) {
    defaultOptionsMap[type] = undefined
  } else {
    currentOptions = getDefaultOptions()
    defaultOptionsMap = {}
  }
}

function createInstance() {
  const state = Vue.observable<ReactiveToastOptions>({ show: false })
  const toggle = (val: boolean) => {
    state.show = val
  }
  const open = (props: Record<string, any>) => {
    const propKeys = keys(props)
    if (!propKeys.length) return
    propKeys.forEach((key) => {
      Vue.set(state, key, props[key])
    })
    toggle(true)
  }
  const { instance, unmount } = mountComponent({
    data: () => ({ content: '' }),
    watch: {
      content(val) {
        ;(this as any).$set(state, 'content', val)
      },
    },
    methods: {
      open,
      close: () => toggle(false),
    },
    render(h) {
      const closed = () => {
        if (isAllowMultiple) {
          queue = queue.filter((item) => item !== instance)
          unmount()
        }
        state.onClosed?.()
      }
      const on = {
        open: () => state.onOpen?.(),
        close: () => state.onClose?.(),
        closed,
        opened: () => state.onOpened?.(),
        'update:show': toggle,
      }
      return h(_SmyToast, { on, props: state })
    },
  })
  return instance as ToastInstance
}

function getInstance() {
  if (!queue.length || isAllowMultiple) {
    const instance = createInstance()

    queue.push(instance)
    return instance
  } else {
    return queue[0]
  }
}

Toast.Component = _SmyToast

Toast.install = _SmyToast.install

export { _SmyToast as SmyToast, Toasts }

export default assign(Toast, Toasts)
