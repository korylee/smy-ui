import type { ToastProps, ToastType } from './props'
import type { VNode } from 'vue'
import type { SmyComponent } from '../_utils/smy/component'

import { MountedInstance, mountComponent, withInstall } from '../_utils/vue/component'
import _Toast from './Toast'
import { isNumber, isPlainObject, isString, assign } from '@smy-h5/shared'
import Vue from 'vue'
import { TOAST_TYPES } from './props'
import { throwError } from '../_utils/smy/warn'

declare interface SmyToast extends SmyComponent {
  new (): {
    $props: ToastProps
    $scopedSlots: {
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

type ToastInstance = MountedInstance<{
  content: string
  close: () => void
  open: (opts: ReactiveToastOptions) => void
  refresh: () => void
}>

let isAllowMultiple = false
let queue: ToastInstance[] = []

const getDefaultOptions = (): ReactiveToastOptions => ({
  type: undefined,
  content: '',
  position: 'center',
  duration: 3500,
  contentClass: undefined,
  loadingType: 'circle',
  lockScroll: false,
  teleport: undefined,
  forbidClick: false,
  icon: undefined,
})

let currentOptions = getDefaultOptions()

let defaultOptionsMap: { [key in ToastType]?: Omit<ReactiveToastOptions, 'type'> } = {}

const Toast = function toast(options: number | string | ReactiveToastOptions) {
  const toastOptions = isString(options) || isNumber(options) ? { content: String(options) } : options
  const reactiveToastOptions = Vue.observable(
    assign({}, currentOptions, toastOptions.type && defaultOptionsMap[toastOptions.type], toastOptions),
  )
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

const Toasts = TOAST_TYPES.reduce(
  (acc, cur) => {
    acc[cur] = getToast(cur)
    return acc
  },
  {} as { [type in ToastType]: ReturnType<typeof getToast> },
)

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
  const state = Vue.observable<{ value: ReactiveToastOptions }>({ value: { show: false } })
  const toggle = (val: boolean) => {
    Vue.set(state.value, 'show', val)
  }
  const open = (props: Record<string, any>) => {
    Vue.set(state, 'value', props)
    toggle(true)
  }
  const { instance, unmount } = mountComponent({
    data: () => ({ content: '' }),
    watch: {
      content(val) {
        ;(this as any).$set(state.value, 'content', val)
      },
    },
    methods: {
      open,
      close: () => toggle(false),
      refresh() {
        const { toast } = this.$refs
        ;(toast as any)?.updateAfterDuration?.()
      },
    },
    render(h) {
      const stateValue = state.value
      const closed = () => {
        if (isAllowMultiple) {
          queue = queue.filter((item) => item !== instance)
          unmount()
        }
        stateValue.onClosed?.()
      }
      const on = {
        open: () => stateValue.onOpen?.(),
        close: () => stateValue.onClose?.(),
        closed,
        opened: () => stateValue.onOpened?.(),
        'update:show': toggle,
      }
      return h(_SmyToast, { on, props: stateValue, ref: 'toast' })
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
    const instance = queue[0]
    instance.refresh()
    return instance
  }
}

Toast.Component = _SmyToast

Toast.install = _SmyToast.install

export { _SmyToast as SmyToast, Toasts }

export default assign(Toast, Toasts)
