import type { ToastPosition, ToastProps, ToastType } from './props'
import type { CreateElement } from 'vue'

import { createInstall } from '../_utils/components'
import SmyToast from './Toast.vue'
import SmyToastCore from './ToastCore.vue'
import { isNumber, isPlainObject, isString, toNumber } from '../_utils/shared'
import Vue from 'vue'
import { mountComponent } from '@smy-h5/vtools'
import { TOAST_TYPES } from './props'
import context from '../_context'
import { throwError } from '../_utils/smy'
// type MutablePartial<T> = {
//   -readonly [K in keyof T]?: T[K]
// }

export type ReactiveToastOptions = Partial<ToastProps> & {
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
}

interface UniqToastOptionItem {
  id: number
  reactiveToastOptions: ReactiveToastOptions
  customUpdate?: string
  animationEnd?: boolean
}

let sid = 0
let isMount = false
let unmount: () => void
let isAllowMultiple = false
const uniqToastOptions = Vue.observable<{ value: UniqToastOptionItem[] }>({
  value: [],
})

const defaultOptions: ReactiveToastOptions = {
  type: undefined,
  content: '',
  position: 'top',
  duration: 3500,
  vertical: false,
  contentClass: undefined,
  loadingType: 'circle',
  loadingSize: 'normal',
  lockScroll: false,
  teleport: 'body',
  forbidClick: false,
}

let currentOptions = {
  ...defaultOptions,
}

let defaultOptionsMap: { [key in ToastType]?: Omit<ReactiveToastOptions, 'type'> } = {}

function getCoreVNode(h: CreateElement, option: UniqToastOptionItem) {
  const { id, reactiveToastOptions, customUpdate } = option
  const attrs = {
    ...reactiveToastOptions,
    'data-id': id,
    customUpdate,
  }
  const directives = [{ name: 'show', rawName: 'v-show', value: reactiveToastOptions.show, expression: 'show' }]
  const style = {
    position: isAllowMultiple ? 'relative' : 'absolute',
    top: getTop(reactiveToastOptions.position),
  }
  const on = {
    'update:show': (value) => {
      reactiveToastOptions.show = value
    },
    open: () => {
      reactiveToastOptions?.onOpen?.()
    },
    close: () => {
      reactiveToastOptions?.onClose?.()
    },
  }
  return h(SmyToastCore as any, {
    key: id,
    attrs,
    style,
    directives,
    on,
  })
}

const TransitionGroupHost = {
  render(h) {
    let isPointerAuto = false
    const toastList = uniqToastOptions.value.map(({ id, reactiveToastOptions, customUpdate }) => {
      if (reactiveToastOptions.forbidClick || reactiveToastOptions.type === 'loading') {
        isPointerAuto = true
      }

      if (isAllowMultiple) reactiveToastOptions.position = 'top'
      return getCoreVNode(h, { id, reactiveToastOptions, customUpdate })
    })
    return h(
      'transition-group',
      {
        attrs: {
          name: 'smy-toast-fade',
          tag: 'div',
          class: `smy-transition-group ${isPointerAuto ? 'smy-pointer-auto' : ''}`,
        },
        style: {
          zIndex: context.zIndex,
        },
        on: {
          'after-enter': opened,
          'after-leave': removeUniqOption,
        },
      },
      toastList
    )
  },
}

const Toast = function toast(options: number | string | ReactiveToastOptions) {
  const toastOptions = isString(options) || isNumber(options) ? { content: String(options) } : options
  const reactiveToastOptions = Vue.observable({
    ...currentOptions,
    ...defaultOptionsMap[toastOptions.type],
    ...toastOptions,
  })
  Vue.set(reactiveToastOptions, 'show', true)
  if (!isMount) {
    isMount = true
    unmount = mountComponent(TransitionGroupHost).unmount
  }
  const { length } = uniqToastOptions.value
  const uniqToastOptionItem = {
    id: sid++,
    reactiveToastOptions,
  }
  if (!length || isAllowMultiple) {
    addUniqOption(uniqToastOptionItem)
  } else {
    const customUpdate = `update-${sid}`
    updateUniqOption(reactiveToastOptions, customUpdate)
  }
  return {
    clear() {
      if (!isAllowMultiple && uniqToastOptions.value.length) {
        uniqToastOptions.value[0].reactiveToastOptions.show = false
      } else {
        reactiveToastOptions.show = false
      }
    },
  }
}

const getToast = (type: ToastType) => (options: Parameters<typeof Toast>[0]) => {
  if (isString(options) || isNumber(options)) {
    options = { content: String(options), type }
  } else {
    options.type = type
  }
  return Toast(options)
}

const Toasts: { [type in ToastType]: ReturnType<typeof getToast> } = TOAST_TYPES.reduce((acc, cur) => {
  acc[cur] = getToast(cur)
  return acc
}, {} as any)

Toast.allowMultiple = function (bool = false) {
  if (!bool !== isAllowMultiple) {
    uniqToastOptions.value.forEach((option) => {
      option.reactiveToastOptions.show = false
    })
    isAllowMultiple = bool
  }
}

Toast.clear = function () {
  uniqToastOptions.value.forEach((option) => {
    option.reactiveToastOptions.show = false
  })
}

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
    Object.assign(currentOptions, key)
  }
}

Toast.setDefaultOptions = setDefaultOptions

Toast.resetDefaultOptions = function resetDefaultOptions(type: ToastType) {
  if (isString(type)) {
    defaultOptionsMap[type] = undefined
  } else {
    currentOptions = { ...defaultOptions }
    defaultOptionsMap = {}
  }
}

Toast.Component = SmyToast

function opened(el: HTMLElement) {
  const id = el.getAttribute('data-id')
  const option = uniqToastOptions.value.find((option) => option.id === toNumber(id))
  if (option) {
    option.reactiveToastOptions.onOpened?.()
  }
}

function removeUniqOption(el: HTMLElement) {
  el.parentElement?.classList.remove('smy-pointer-auto')
  const id = el.getAttribute('data-id')
  const option = uniqToastOptions.value.find((option) => option.id === toNumber(id))
  if (option) {
    option.animationEnd = true
    option.reactiveToastOptions.onClosed?.()
  }
  const isAllAnimationEnd = uniqToastOptions.value.every((option) => option.animationEnd)
  if (isAllAnimationEnd) {
    unmount?.()
    uniqToastOptions.value = []
    isMount = false
  }
}

function addUniqOption(uniqToastOptionItem: UniqToastOptionItem) {
  uniqToastOptions.value.push(uniqToastOptionItem)
}

function updateUniqOption(reactiveTaostOptions: ReactiveToastOptions, customUpdate: string) {
  const [firstOption] = uniqToastOptions.value
  firstOption.reactiveToastOptions = {
    ...firstOption.reactiveToastOptions,
    ...reactiveTaostOptions,
  }
  firstOption.customUpdate = customUpdate
}

function getTop(position: ToastPosition = 'top') {
  switch (position) {
    case 'center':
      return '45%'
    case 'bottom':
      return '85%'
    default:
      return '50px'
  }
}

const install = createInstall(SmyToast)

SmyToast.install = install

Toast.install = install

export { SmyToast, Toasts }

export default Object.assign(Toast, Toasts)
