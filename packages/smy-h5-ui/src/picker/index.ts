import type { Column, PickerProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import { mountComponent, withInstall } from '../_utils/vue/component'
import _Picker from './Picker.vue'
import { isArray, isNil } from '../_utils/is'
import Vue, { type VNode } from 'vue'

type PartialRequired<T, R extends keyof T> = Omit<T, R> &
  Required<{
    [O in R]: T[O]
  }>

type PickerOptions = PartialRequired<Omit<PickerProps, 'popup'>, 'columns'> & {
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
  onClickOverlay?: () => void
  onChange?: (values: PickedValues, indexes: number[]) => void
  onConfirm?: (values: PickedValues, indexes: number[]) => void
  onCancel?: (values: PickedValues, indexes: number[]) => void
}

type PickedValues = any[]

type PickerResolvedState = 'confirm' | 'close' | 'cancel'

interface PickerResolvedData {
  state: PickerResolvedState
  values?: PickedValues
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
    }
    $emit: {
      (event: 'open'): void
      (event: 'opened'): void
      (event: 'close'): void
      (event: 'closed'): void
      (event: 'route-change'): void
      (event: 'click-overlay'): void
      (event: 'confirm', values: PickedValues, indexes: number[]): void
      (event: 'cancel', values: PickedValues, indexes: number[]): void
      (event: 'change', values: PickedValues, indexes: number[]): void
    }
  }
}

const _SmyPicker = withInstall(_Picker) as SmyPicker

let singletonInstance: PickerOptions | null

const Picker = function Picker(options: PickerOptions | Column[]): Promise<PickerResolvedData> {
  return new Promise((resolve) => {
    Picker.close()
    const pickerOptions: PickerOptions = isArray(options) ? { columns: options } : options
    const { instance, unmount } = mountComponent(_SmyPicker as any, 'body', {
      propsData: pickerOptions,
    })
    instance.show = true

    singletonInstance = instance
    const clearSingletonInstance = () => singletonInstance === instance && (singletonInstance = null)
    instance.$on('click-overlay', () => pickerOptions.onClickOverlay?.())
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
    instance.$on('change', (values: PickedValues, indexes: number[]) => {
      pickerOptions.onChange?.(values, indexes)
      clearSingletonInstance()
    })
    instance.$on('confirm', (values: PickedValues, indexes: number[]) => {
      pickerOptions.onConfirm?.(values, indexes)
      resolve({ state: 'confirm', values, indexes })
      instance.show = false
      clearSingletonInstance()
    })
    instance.$on('cancel', (values: PickedValues, indexes: number[]) => {
      pickerOptions.onCancel?.(values, indexes)
      resolve({ state: 'cancel', values, indexes })
      instance.show = false
      clearSingletonInstance()
    })
    instance.$on('update:show', (value: boolean) => {
      instance.show = value
    })
    instance.$on('route-change', () => {
      unmount()
      clearSingletonInstance()
    })
    instance.show = true
  })
}

Picker.close = () => {
  if (isNil(singletonInstance)) return
  const preSingletonInstance = singletonInstance
  singletonInstance = null
  return Vue.nextTick().then(() => {
    preSingletonInstance.show = false
  })
}

Picker.Component = _SmyPicker

Picker.install = _SmyPicker.install

export default Picker
