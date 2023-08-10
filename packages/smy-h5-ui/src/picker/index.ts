import type { CascadeColumn, NormalColumn, PickerProps } from './props'

import { mountComponent, withInstall } from '../_utils/vue/component'
import _Picker from './Picker.vue'
import { isArray, isNil } from '../_utils/is'
import { h, nextTick, reactive } from 'vue'
import { assign } from '../_utils/shared'

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

const SmyPicker = withInstall(_Picker)

let singletonOptions: PickerOptions | null

const Picker = function Picker(options: PickerOptions | NormalColumn[] | CascadeColumn[]): Promise<PickerResolvedData> {
  return new Promise((resolve) => {
    Picker.close()
    const pickerOptions: PickerOptions = isArray(options) ? { columns: options } : options
    const reactivePickerOptions: PickerOptions = reactive(
      assign({}, pickerOptions, {
        popup: true,
        onConfirm,
        onCancel,
        onClose,
        onClosed,
        onRouteChange,
        'onUpdate:show': onUpdateShow,
      })
    )
    function onConfirm(values: PickedValues, indexes: number[]) {
      pickerOptions.onConfirm?.(values, indexes)
      resolve({
        state: 'confirm',
        values,
        indexes,
      })
      reactivePickerOptions.show = false
      singletonOptions === reactivePickerOptions && (singletonOptions = null)
    }
    function onCancel(values: PickedValues, indexes: number[]) {
      pickerOptions.onCancel?.(values, indexes)
      resolve({
        state: 'cancel',
        values,
        indexes,
      })
      reactivePickerOptions.show = false
      singletonOptions === reactivePickerOptions && (singletonOptions = null)
    }
    function onClose() {
      pickerOptions.onClose?.()
      resolve({ state: 'close' })
      singletonOptions === reactivePickerOptions && (singletonOptions = null)
    }
    function onClosed() {
      pickerOptions.onClosed?.()
      unmount()
      singletonOptions === reactivePickerOptions && (singletonOptions = null)
    }
    function onRouteChange() {
      unmount()
      singletonOptions === reactivePickerOptions && (singletonOptions = null)
    }
    function onUpdateShow(value: boolean) {
      reactivePickerOptions.show = value
    }

    singletonOptions = reactivePickerOptions
    const { unmount } = mountComponent(() => h(SmyPicker, reactivePickerOptions))
    reactivePickerOptions.show = true
  })
}

Picker.close = function () {
  if (isNil(singletonOptions)) return
  const preSingletonOptions = singletonOptions
  singletonOptions = null

  return nextTick().then(() => {
    preSingletonOptions.show = false
  })
}

Picker.Component = SmyPicker

Picker.install = SmyPicker.install

export default Picker
