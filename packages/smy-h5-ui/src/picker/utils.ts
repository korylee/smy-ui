import Vue from 'vue'
import { Numeric, isNil } from '../_utils/is'
import { isSameValue, range } from '../_utils/shared'
import { SmyComponent } from '../_utils/smy/component'
import { MountedInstance, mountComponent } from '../_utils/vue/component'
import { createNamespace } from '../_utils/vue/create'
import { DisabledFormatter, ScrollColumn } from './props'
import { PopupListeners, popupListenerKeys } from '../popup/shared'
import { IN_BROWSER } from '../_utils/env'

// @ts-ignore
const functionRenderContextPrototype = Vue.FunctionalRenderContext.prototype

export const looseEqual: (a: any, b: any) => boolean = functionRenderContextPrototype._q || isSameValue

const [name, bem] = createNamespace('picker')

export { name, bem }

export const pickerToolbarSlots = ['cancel', 'confirm', 'title', 'toolbar'] as const

export const pickerPopupListeners = popupListenerKeys

export const pickerSharedListeners = [...pickerPopupListeners, 'confirm', 'cancel', 'change', 'update:value'] as const

export function findIndexFromColumn(index: number, scrollColumn: ScrollColumn, getDisabled: DisabledFormatter) {
  const { column } = scrollColumn
  index = range(index, 0, column.length - 1)
  for (let i = index; i < column.length; i++) {
    if (!getDisabled(column[i], scrollColumn)) {
      return i
    }
  }
  for (let i = index - 1; i >= 0; i--) {
    if (!getDisabled(column[i], scrollColumn)) {
      return i
    }
  }
  return 0
}

export type PickedValues = Numeric[]

export type PickerResolvedState = 'confirm' | 'close' | 'cancel'

export interface PickerResolvedData {
  state: PickerResolvedState
  values?: PickedValues
  indexes?: number[]
}

export type PickerSharedListeners = {
  onChange?: (values: PickedValues, indexes: number[]) => void
  onConfirm?: (values: PickedValues, indexes: number[]) => void
  onCancel?: (values: PickedValues, indexes: number[]) => void
} & PopupListeners

export function createPicker<I, O extends PickerSharedListeners>(
  PickComponent: SmyComponent,
  genOptions: (options: I) => O,
) {
  let singletonInstance: MountedInstance<O & { show: boolean }> | null

  const Picker = function Picker(options: I): Promise<PickerResolvedData | void> {
    if (!IN_BROWSER) {
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      Picker.close()
      const pickerOptions = genOptions(options)

      const { instance, unmount } = mountComponent<O & { show: boolean }>(PickComponent as any, 'body', {
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
    const preSingletonInstance: any = singletonInstance
    singletonInstance = null
    return Vue.nextTick().then(() => {
      preSingletonInstance.show = false
    })
  }

  Picker.Component = PickComponent
  Picker.install = PickComponent.install
  return Picker
}
