import type { PickerProps, Text, Texts } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import { mountComponent, withInstall } from '../_utils/vue/component'
import _Picker from './Picker.vue'
import { isArray, isNill } from '../_utils/is'
import Vue, { type VNode } from 'vue'

type PartialRequired<T, R extends keyof T> = Omit<T, R> &
  Required<{
    [O in R]: T[O]
  }>

type PickerOptions = PartialRequired<PickerProps, 'columns'> & {
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
  onChange?: (texts: Texts, indexes: number[]) => void
  onConfirm?: (texts: Texts, indexes: number[]) => void
  onCancel?: (texts: Texts, indexes: number[]) => void
}

type PickerResolvedState = 'confirm' | 'close' | 'cancel'

interface PickerResolvedData {
  state: PickerResolvedState
  texts?: Texts
  indexes?: number[]
}

declare interface SmyPicker extends SmyComponent {
  new (): {
    $props: PickerProps
    $scopeSlots: {
      toolbar: () => VNode
      cancel: () => VNode
      title: () => VNode
      confirm: () => VNode
      top: () => VNode
      item: (data: { text: Text }) => VNode
    }
    $emit: {
      (event: 'open'): void
      (event: 'opened'): void
      (event: 'close'): void
      (event: 'closed'): void
      (event: 'route-change'): void
      (event: 'confirm', texts: Texts, indexes: number[]): void
      (event: 'cancel', texts: Texts, indexes: number[]): void
      (event: 'change', texts: Texts, indexes: number[]): void
    }
  }
}

const _SmyPicker = withInstall(_Picker) as SmyPicker

let singletonInstance: PickerOptions | null

const Picker = function Picker(options: PickerOptions | Texts[]): Promise<PickerResolvedData> {
  return new Promise((resolve) => {
    Picker.close()
    const pickerOptions: PickerOptions = isArray(options) ? { columns: options } : options
    const { instance, unmount } = mountComponent(_SmyPicker as any, 'body', {
      propsData: pickerOptions,
    })
    instance.show = true

    singletonInstance = instance
    const clearSingletonInstance = () => singletonInstance === instance && (singletonInstance = null)
    instance.$on('open', () => pickerOptions.onOpen?.())
    instance.$on('opened', () => pickerOptions.onOpened?.())
    instance.$on('close', () => {
      pickerOptions.onClose?.()
      resolve({ state: 'close' })
      clearSingletonInstance()
    })
    instance.$on('closed', () => {
      pickerOptions.onClosed?.()
      unmount()
      clearSingletonInstance()
    })
    instance.$on('change', (texts: Texts, indexes: number[]) => {
      pickerOptions.onChange?.(texts, indexes)
      clearSingletonInstance()
    })
    instance.$on('confirm', (texts: Texts, indexes: number[]) => {
      pickerOptions.onConfirm?.(texts, indexes)
      resolve({ state: 'confirm', texts, indexes })
      instance.show = false
      clearSingletonInstance()
    })
    instance.$on('cancel', (texts: Texts, indexes: number[]) => {
      pickerOptions.onCancel?.(texts, indexes)
      resolve({ state: 'cancel', texts, indexes })
      instance.show = false
      clearSingletonInstance()
    })
    instance.$on('route-change', () => {
      unmount()
      clearSingletonInstance()
    })
    instance.show = true
  })
}

Picker.close = async () => {
  if (isNill(singletonInstance)) return
  const preSingletonInstance = singletonInstance
  singletonInstance = null
  await Vue.nextTick()
  preSingletonInstance.show = false
}

Picker.Component = _SmyPicker

Picker.install = _SmyPicker.install

export default Picker
