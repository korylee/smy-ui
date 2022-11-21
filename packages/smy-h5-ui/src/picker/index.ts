import type { PickerProps, Texts } from './props'

import { withInstall } from '../_utils/components'
import SmyPicker from './Picker.vue'
import { isArray, isNill } from '../_utils/is'
import Vue from 'vue'
import { mountComponent } from '@smy-h5/vtools'

type OmitPartial<T, K extends keyof T> = Partial<Omit<T, K>> & {
  [P in K]: T[P]
}

type PickerOptions = OmitPartial<PickerProps, 'columns'> & {
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

let singletonInstance: PickerOptions | null

const Picker = function Picker(options: PickerOptions | Texts[]): Promise<PickerResolvedData> {
  return new Promise((resolve) => {
    Picker.close()
    const pickerOptions: PickerOptions = isArray(options) ? { columns: options } : options
    const { instance, unmount } = mountComponent(SmyPicker, 'body', {
      propsData: pickerOptions,
    })
    instance.show = true

    singletonInstance = instance
    const clearSingletonInstance = () => singletonInstance === instance && (singletonInstance = null)
    instance.$on('open', () => pickerOptions.onOpen?.())
    instance.$on('opened', () => pickerOptions.onOpened?.())
    instance.$on('close', () => {
      pickerOptions.onClose()
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
    instance.$on('cancel', (texts, indexes: number[]) => {
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

Picker.Coponent = withInstall(SmyPicker)

Picker.install = SmyPicker.install

export default SmyPicker
